terraform {
  required_providers {
    openstack = {
      source  = "terraform-provider-openstack/openstack"
      version = "~> 1.51.1"
    }
  }
}

provider "openstack" {}

######################
# Génération des clés
######################

resource "random_id" "key_suffix" {
  byte_length = 4
}

resource "tls_private_key" "ssh_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "openstack_compute_keypair_v2" "ssh_key" {
  name       = "ssh_key_for_ubuntu_${random_id.key_suffix.hex}"
  public_key = tls_private_key.ssh_key.public_key_openssh
}

resource "local_file" "ssh_private_key" {
  content         = tls_private_key.ssh_key.private_key_openssh
  filename        = "${path.module}/generated_key.pem"
  file_permission = "0600"
}

######################
# Groupe de sécurité
######################

resource "openstack_networking_secgroup_v2" "webserver_sg" {
  name        = "webserver-security-group"
  description = "Security group for web servers"
}

resource "openstack_networking_secgroup_rule_v2" "ssh_rule" {
  direction         = "ingress"
  ethertype         = "IPv4"
  protocol          = "tcp"
  port_range_min    = 22
  port_range_max    = 22
  remote_ip_prefix  = "0.0.0.0/0"
  security_group_id = openstack_networking_secgroup_v2.webserver_sg.id
}

resource "openstack_networking_secgroup_rule_v2" "http_rule" {
  direction         = "ingress"
  ethertype         = "IPv4"
  protocol          = "tcp"
  port_range_min    = 80
  port_range_max    = 80
  remote_ip_prefix  = "0.0.0.0/0"
  security_group_id = openstack_networking_secgroup_v2.webserver_sg.id
}

resource "openstack_networking_secgroup_rule_v2" "icmp_rule" {
  direction         = "ingress"
  ethertype         = "IPv4"
  protocol          = "icmp"
  remote_ip_prefix  = "0.0.0.0/0"
  security_group_id = openstack_networking_secgroup_v2.webserver_sg.id
}

resource "openstack_networking_secgroup_rule_v2" "worker_kubelet" {
  security_group_id = openstack_networking_secgroup_v2.webserver_sg.id
  direction         = "ingress"
  protocol          = "tcp"
  port_range_min    = 10250
  port_range_max    = 10250
  remote_ip_prefix  = "0.0.0.0/0"
}

# NodePort range
resource "openstack_networking_secgroup_rule_v2" "nodeport_tcp" {
  security_group_id = openstack_networking_secgroup_v2.webserver_sg.id
  direction         = "ingress"
  protocol          = "tcp"
  port_range_min    = 30000
  port_range_max    = 32767
  remote_ip_prefix  = "0.0.0.0/0"
}

resource "openstack_networking_secgroup_rule_v2" "nodeport_udp" {
  security_group_id = openstack_networking_secgroup_v2.webserver_sg.id
  direction         = "ingress"
  protocol          = "udp"
  port_range_min    = 30000
  port_range_max    = 32767
  remote_ip_prefix  = "0.0.0.0/0"
}

# Calico BGP
resource "openstack_networking_secgroup_rule_v2" "calico_bgp_worker" {
  security_group_id = openstack_networking_secgroup_v2.webserver_sg.id
  direction         = "ingress"
  protocol          = "tcp"
  port_range_min    = 179
  port_range_max    = 179
  remote_ip_prefix  = "0.0.0.0/0"
}


##############pour master k8

resource "openstack_networking_secgroup_v2" "k8s_master_sg" {
  name        = "k8s-master_security-group"
  description = "Security group for Kubernetes master node"
}

# API Server
resource "openstack_networking_secgroup_rule_v2" "master_api" {
  security_group_id = openstack_networking_secgroup_v2.k8s_master_sg.id
  direction         = "ingress"
  protocol          = "tcp"
  port_range_min    = 6443
  port_range_max    = 6443
  remote_ip_prefix  = "0.0.0.0/0"
}

# etcd
resource "openstack_networking_secgroup_rule_v2" "etcd" {
  security_group_id = openstack_networking_secgroup_v2.k8s_master_sg.id
  direction         = "ingress"
  protocol          = "tcp"
  port_range_min    = 2379
  port_range_max    = 2380
  remote_ip_prefix  = "0.0.0.0/0"
}

# kubelet API
resource "openstack_networking_secgroup_rule_v2" "kubelet_master" {
  security_group_id = openstack_networking_secgroup_v2.k8s_master_sg.id
  direction         = "ingress"
  protocol          = "tcp"
  port_range_min    = 10250
  port_range_max    = 10250
  remote_ip_prefix  = "0.0.0.0/0"
}

# scheduler
resource "openstack_networking_secgroup_rule_v2" "scheduler" {
  security_group_id = openstack_networking_secgroup_v2.k8s_master_sg.id
  direction         = "ingress"
  protocol          = "tcp"
  port_range_min    = 10259
  port_range_max    = 10259
  remote_ip_prefix  = "0.0.0.0/0"
}

# controller-manager
resource "openstack_networking_secgroup_rule_v2" "controller_manager" {
  security_group_id = openstack_networking_secgroup_v2.k8s_master_sg.id
  direction         = "ingress"
  protocol          = "tcp"
  port_range_min    = 10257
  port_range_max    = 10257
  remote_ip_prefix  = "0.0.0.0/0"
}

# Calico BGP
resource "openstack_networking_secgroup_rule_v2" "calico_bgp_master" {
  security_group_id = openstack_networking_secgroup_v2.k8s_master_sg.id
  direction         = "ingress"
  protocol          = "tcp"
  port_range_min    = 179
  port_range_max    = 179
  remote_ip_prefix  = "0.0.0.0/0"
}

######################
# Création de l'instance
######################

resource "openstack_compute_instance_v2" "k8s_worker" {
  count           = 2
  name            = "k8s-worker-${count.index + 1}"
  image_name      = "ubuntu-server24.04"
  flavor_name     = "m1.small"
  key_pair        = openstack_compute_keypair_v2.ssh_key.name
  security_groups = [openstack_networking_secgroup_v2.webserver_sg.id]

  power_state = "active"  # Changé de "shutoff" à "active"

  network {
    name = "internal"
  }

  user_data = <<-EOF
    #cloud-config
    users:
      - name: ubuntu
        groups: sudo
        shell: /bin/bash
        sudo: ["ALL=(ALL) NOPASSWD:ALL"]
        ssh_authorized_keys:
          - ${tls_private_key.ssh_key.public_key_openssh}
    ssh_pwauth: false
    disable_root: true
  EOF

  timeouts {
    create = "10m"
    delete = "10m"
  }

  lifecycle {
    ignore_changes = [power_state]
  }
}

resource "openstack_compute_instance_v2" "k8s_master" {
  name            = "k8s-master"
  image_name      = "ubuntu-server24.04"  # Vérifie que cette image existe
  flavor_name     = "m1.devops"         # Vérifie que ce flavor existe
  key_pair        = openstack_compute_keypair_v2.ssh_key.name
  #security_groups = [openstack_networking_secgroup_v2.webserver_sg.name]
  security_groups = [openstack_networking_secgroup_v2.k8s_master_sg.id]

  # CORRECTION : Réseau correct
  network {
    name = "internal"
  }

  # CORRECTION : user_data simplifié et sécurisé
  user_data = <<-EOF
    #cloud-config
    users:
      - name: ubuntu
        groups: sudo
        shell: /bin/bash
        sudo: ["ALL=(ALL) NOPASSWD:ALL"]
        ssh_authorized_keys:
          - ${tls_private_key.ssh_key.public_key_openssh}
    ssh_pwauth: false
    disable_root: true
  EOF

  timeouts {
    create = "10m"
    delete = "10m"
  }
}


######################
# Affichage de l'adresse IP
######################

output "worker_ip" {
  value = openstack_compute_instance_v2.k8s_worker[*].access_ip_v4
}

output "k8s_worker_1_floating_ip" {
  value = openstack_networking_floatingip_v2.fip_k8s_worker[0].address
}

output "k8s_worker_2_floating_ip" {
  value = openstack_networking_floatingip_v2.fip_k8s_worker[1].address
}

output "master_ip" {
  value = openstack_compute_instance_v2.k8s_master.access_ip_v4
}

output "k8s_master_floating_ip" {
  value = openstack_networking_floatingip_v2.fip_k8s_master.address
}

output "jenkins_ip" {
  value = openstack_compute_instance_v2.jenkins_server.access_ip_v4
}

output "jenkins_server_floating_ip" {
  value = openstack_networking_floatingip_v2.fip_jenkins.address
}

######################
# Groupe de sécurité Jenkins
######################

resource "openstack_compute_secgroup_v2" "jenkins_sg" {
  name        = "jenkins-security-group"
  description = "Security group for Jenkins server"

  rule {
    from_port   = 22
    to_port     = 22
    ip_protocol = "tcp"
    cidr        = "0.0.0.0/0"
  }

  rule {
    from_port   = 8080
    to_port     = 8080
    ip_protocol = "tcp"
    cidr        = "0.0.0.0/0"
  }
  rule {
    from_port   = 9000
    to_port     = 9000
    ip_protocol = "tcp"
    cidr        = "0.0.0.0/0"
  }

  rule {
    from_port   = -1
    to_port     = -1
    ip_protocol = "icmp"
    cidr        = "0.0.0.0/0"
  }
}

######################
# Instance Jenkins
######################

resource "openstack_compute_instance_v2" "jenkins_server" {
  name            = "jenkins-server"
  image_name      = "ubuntu-server24.04"
  flavor_name     = "m2.devops"
  key_pair        = openstack_compute_keypair_v2.ssh_key.name
  security_groups = [openstack_compute_secgroup_v2.jenkins_sg.id]

  power_state = "active"  # Changé de "shutoff" à "active"

  network {
    name = "internal"
  }

  user_data = <<-EOF
    #cloud-config
    users:
      - name: ubuntu
        groups: sudo
        shell: /bin/bash
        sudo: ["ALL=(ALL) NOPASSWD:ALL"]
        ssh_authorized_keys:
          - ${tls_private_key.ssh_key.public_key_openssh}
    ssh_pwauth: false
    disable_root: true
  EOF

  timeouts {
    create = "10m"
    delete = "10m"
  }

  lifecycle {
    ignore_changes = [power_state]
  }

}

resource "openstack_networking_floatingip_v2" "fip_jenkins" {
  pool = "public"   # Nom du réseau externe
}

# 3. Associer la Floating IP à l’instance

resource "openstack_compute_floatingip_associate_v2" "fip_assoc_jenkins" {
  floating_ip = openstack_networking_floatingip_v2.fip_jenkins.address
  instance_id = openstack_compute_instance_v2.jenkins_server.id
}

# Floating IP pour le master K8s
resource "openstack_networking_floatingip_v2" "fip_k8s_master" {
  pool = "public"
}

resource "openstack_compute_floatingip_associate_v2" "fip_assoc_k8s_master" {
  floating_ip = openstack_networking_floatingip_v2.fip_k8s_master.address
  instance_id = openstack_compute_instance_v2.k8s_master.id
}

# Floating IPs pour les workers K8s - CORRIGÉ
resource "openstack_networking_floatingip_v2" "fip_k8s_worker" {
  count = 2
  pool  = "public"
}

resource "openstack_compute_floatingip_associate_v2" "fip_assoc_k8s_worker" {
  count = 2
  instance_id = openstack_compute_instance_v2.k8s_worker[count.index].id
  floating_ip = openstack_networking_floatingip_v2.fip_k8s_worker[count.index].address
}

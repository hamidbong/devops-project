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

resource "openstack_compute_secgroup_v2" "webserver_sg" {
  name        = "webserver-security-group"
  description = "Security group for web servers"

  rule {
    from_port   = 22
    to_port     = 22
    ip_protocol = "tcp"
    cidr        = "0.0.0.0/0"
  }

  rule {
    from_port   = 80
    to_port     = 80
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
# Création de l'instance
######################

resource "openstack_compute_instance_v2" "k8s_worker" {
#  name            = "webservers2"
  count           = 2
  name            = "k8s-worker-${count.index + 1}"
  image_name      = "ubuntu_22.04_img"  # ⚠️ assure-toi que cette image existe dans OpenStack
  flavor_name     = "m2.devops"
  key_pair        = openstack_compute_keypair_v2.ssh_key.name
  security_groups = [openstack_compute_secgroup_v2.webserver_sg.name]

  network {
    uuid = "55ed18af-9229-40b1-9c2b-d89d275ecf5d"  # ⚠️ remplace par ton réseau
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
}

resource "openstack_compute_instance_v2" "k8s_master" {
#  name            = "webservers2"
  name            = "k8s-master"
  image_name      = "ubuntu_22.04_img"  # ⚠️ assure-toi que cette image existe dans OpenStack
  flavor_name     = "m2.devops"
  key_pair        = openstack_compute_keypair_v2.ssh_key.name
  security_groups = [openstack_compute_secgroup_v2.webserver_sg.name]

  network {
    uuid = "55ed18af-9229-40b1-9c2b-d89d275ecf5d"  # ⚠️ remplace par ton réseau
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
}


######################
# Affichage de l'adresse IP
######################

#output "worker_ips_1" {
#  value = openstack_compute_instance_v2.k8s-worker.access_ip_v4
#}

#output "worker_ips_2" {
#  value = openstack_compute_instance_v2.k8s-worker-2.access_ip_v4
#}

output "master_public_ip" {
  value = openstack_compute_instance_v2.k8s_master.access_ip_v4
}


output "jenkins_ip" {
  value = openstack_compute_instance_v2.jenkins_server.access_ip_v4
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
  image_name      = "ubuntu_22.04_img"
  flavor_name     = "m1.medium"
  key_pair        = openstack_compute_keypair_v2.ssh_key.name
  security_groups = [openstack_compute_secgroup_v2.jenkins_sg.name]

  network {
    uuid = "55ed18af-9229-40b1-9c2b-d89d275ecf5d"
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
}

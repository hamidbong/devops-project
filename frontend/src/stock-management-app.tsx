import React, { useState, useEffect } from 'react';
import { User, Package, BarChart3, LogOut, Plus, Edit, Trash2, Search, Eye, EyeOff } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const StockManagementApp = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [products, setProducts] = useState([
    { id: 1, name: 'Ordinateur Portable', category: 'Électronique', quantity: 25, price: 899.99, minStock: 5 },
    { id: 2, name: 'Souris Wireless', category: 'Accessoires', quantity: 50, price: 29.99, minStock: 10 },
    { id: 3, name: 'Clavier Mécanique', category: 'Accessoires', quantity: 15, price: 89.99, minStock: 8 },
    { id: 4, name: 'Écran 27"', category: 'Électronique', quantity: 12, price: 299.99, minStock: 3 },
    { id: 5, name: 'Imprimante Laser', category: 'Bureau', quantity: 8, price: 199.99, minStock: 2 },
    { id: 6, name: 'Webcam HD', category: 'Accessoires', quantity: 30, price: 79.99, minStock: 5 }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Composant de connexion
  const LoginForm = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleLogin = () => {
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        setCurrentUser({ username: 'admin', role: 'Administrateur' });
        setCurrentPage('dashboard');
        setError('');
      } else {
        setError('Nom d\'utilisateur ou mot de passe incorrect');
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 w-full max-w-md shadow-2xl">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-blue-400 to-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Package className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">StockPro</h1>
            <p className="text-blue-200">Gestion de Stock Intelligente</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Nom d'utilisateur</label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                placeholder="admin"
              />
            </div>
            
            <div>
              <label className="block text-white text-sm font-medium mb-2">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm pr-12"
                  placeholder="admin123"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-200 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-500/20 border border-red-400/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <button
              type="button"
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Se connecter
            </button>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-blue-200 text-sm">Identifiants de test: admin / admin123</p>
          </div>
        </div>
      </div>
    );
  };

  // Navigation
  const Navigation = () => (
    <nav className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-4 shadow-2xl border-b border-slate-700">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <Package className="text-blue-400" size={24} />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">StockPro</span>
          </div>
          
          <div className="flex space-x-6">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                currentPage === 'dashboard' 
                  ? 'bg-blue-600 shadow-lg shadow-blue-600/30' 
                  : 'hover:bg-slate-700'
              }`}
            >
              <BarChart3 size={18} />
              <span>Tableau de bord</span>
            </button>
            
            <button
              onClick={() => setCurrentPage('products')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                currentPage === 'products' 
                  ? 'bg-blue-600 shadow-lg shadow-blue-600/30' 
                  : 'hover:bg-slate-700'
              }`}
            >
              <Package size={18} />
              <span>Produits</span>
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-slate-700 px-3 py-2 rounded-lg">
            <User size={16} />
            <span className="text-sm">{currentUser.username}</span>
          </div>
          <button
            onClick={() => {
              setCurrentUser(null);
              setCurrentPage('login');
            }}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </nav>
  );

  // Tableau de bord
  const Dashboard = () => {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, product) => sum + (product.quantity * product.price), 0);
    const lowStockProducts = products.filter(product => product.quantity <= product.minStock);
    const totalQuantity = products.reduce((sum, product) => sum + product.quantity, 0);

    const categoryData = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + product.quantity;
      return acc;
    }, {});

    const pieData = Object.entries(categoryData).map(([category, quantity]) => ({
      name: category,
      value: quantity
    }));

    const stockData = products.map(product => ({
      name: product.name.substring(0, 10) + '...',
      stock: product.quantity,
      min: product.minStock
    }));

    const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6B7280'];

    return (
      <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Tableau de bord</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Produits</p>
                <p className="text-3xl font-bold">{totalProducts}</p>
              </div>
              <Package className="text-blue-200" size={32} />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Valeur Stock</p>
                <p className="text-3xl font-bold">{totalValue.toLocaleString('fr-FR', {style: 'currency', currency: 'EUR'})}</p>
              </div>
              <BarChart3 className="text-green-200" size={32} />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Stock Faible</p>
                <p className="text-3xl font-bold">{lowStockProducts.length}</p>
              </div>
              <div className="text-orange-200 text-2xl">⚠️</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Quantité Totale</p>
                <p className="text-3xl font-bold">{totalQuantity}</p>
              </div>
              <div className="text-purple-200 text-2xl">📦</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
            <h3 className="text-xl font-semibold mb-4 text-slate-700">Stock par Produit</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: 'white'
                  }} 
                />
                <Bar dataKey="stock" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="min" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
            <h3 className="text-xl font-semibold mb-4 text-slate-700">Répartition par Catégorie</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {lowStockProducts.length > 0 && (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-red-800 mb-4">⚠️ Alertes Stock Faible</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockProducts.map(product => (
                <div key={product.id} className="bg-white p-4 rounded-lg shadow border-l-4 border-red-400">
                  <h4 className="font-semibold text-slate-800">{product.name}</h4>
                  <p className="text-red-600">Stock: {product.quantity} (Min: {product.minStock})</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Gestion des produits
  const ProductManagement = () => {
    const [productForm, setProductForm] = useState({
      name: '', category: '', quantity: '', price: '', minStock: ''
    });

    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddProduct = () => {
      const newProduct = {
        id: Date.now(),
        name: productForm.name,
        category: productForm.category,
        quantity: parseInt(productForm.quantity),
        price: parseFloat(productForm.price),
        minStock: parseInt(productForm.minStock)
      };
      setProducts([...products, newProduct]);
      setProductForm({ name: '', category: '', quantity: '', price: '', minStock: '' });
      setShowAddForm(false);
    };

    const handleEditProduct = (product) => {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        category: product.category,
        quantity: product.quantity.toString(),
        price: product.price.toString(),
        minStock: product.minStock.toString()
      });
      setShowAddForm(true);
    };

    const handleUpdateProduct = () => {
      const updatedProducts = products.map(product =>
        product.id === editingProduct.id
          ? {
              ...product,
              name: productForm.name,
              category: productForm.category,
              quantity: parseInt(productForm.quantity),
              price: parseFloat(productForm.price),
              minStock: parseInt(productForm.minStock)
            }
          : product
      );
      setProducts(updatedProducts);
      setProductForm({ name: '', category: '', quantity: '', price: '', minStock: '' });
      setShowAddForm(false);
      setEditingProduct(null);
    };

    const handleDeleteProduct = (id) => {
      if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        setProducts(products.filter(product => product.id !== id));
      }
    };

    return (
      <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Gestion des Produits</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus size={20} />
            <span>Ajouter Produit</span>
          </button>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            />
          </div>
        </div>

        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 text-slate-800">
                {editingProduct ? 'Modifier le Produit' : 'Ajouter un Produit'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-2">Nom du produit</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-slate-700 font-medium mb-2">Catégorie</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    <option value="Électronique">Électronique</option>
                    <option value="Accessoires">Accessoires</option>
                    <option value="Bureau">Bureau</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">Quantité</label>
                    <input
                      type="number"
                      value={productForm.quantity}
                      onChange={(e) => setProductForm({...productForm, quantity: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">Prix (€)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-slate-700 font-medium mb-2">Stock minimum</label>
                  <input
                    type="number"
                    value={productForm.minStock}
                    onChange={(e) => setProductForm({...productForm, minStock: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                  >
                    {editingProduct ? 'Modifier' : 'Ajouter'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingProduct(null);
                      setProductForm({ name: '', category: '', quantity: '', price: '', minStock: '' });
                    }}
                    className="flex-1 bg-slate-500 text-white py-3 rounded-lg font-semibold hover:bg-slate-600 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Produit</th>
                  <th className="px-6 py-4 text-left font-semibold">Catégorie</th>
                  <th className="px-6 py-4 text-left font-semibold">Quantité</th>
                  <th className="px-6 py-4 text-left font-semibold">Prix</th>
                  <th className="px-6 py-4 text-left font-semibold">Stock Min</th>
                  <th className="px-6 py-4 text-left font-semibold">Statut</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <tr key={product.id} className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                    <td className="px-6 py-4 font-medium text-slate-800">{product.name}</td>
                    <td className="px-6 py-4 text-slate-600">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-800 font-semibold">{product.quantity}</td>
                    <td className="px-6 py-4 text-slate-800 font-semibold">
                      {product.price.toLocaleString('fr-FR', {style: 'currency', currency: 'EUR'})}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{product.minStock}</td>
                    <td className="px-6 py-4">
                      {product.quantity <= product.minStock ? (
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                          Stock faible
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          Stock OK
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <Package size={48} className="mx-auto mb-4 text-slate-300" />
              <p className="text-lg">Aucun produit trouvé</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Rendu principal
  if (!currentUser) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navigation />
      {currentPage === 'dashboard' && <Dashboard />}
      {currentPage === 'products' && <ProductManagement />}
    </div>
  );
};

export default StockManagementApp;
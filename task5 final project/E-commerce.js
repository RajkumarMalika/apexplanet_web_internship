
        // --- DATA ---
        const products = [
            { id: 1, name: 'Classic Crewneck T-Shirt', price: 25.00, image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60', description: 'A timeless classic made from 100% premium cotton for ultimate comfort and style.' },
            { id: 2, name: 'Slim-Fit Chino Pants', price: 65.00, image: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60', description: 'Versatile and stylish, these chinos are perfect for both casual and semi-formal occasions.' },
            { id: 3, name: 'Leather Biker Jacket', price: 250.00, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60', description: 'Make a bold statement with this iconic jacket crafted from genuine leather.' },
            { id: 4, name: 'Minimalist Sneakers', price: 90.00, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60', description: 'Clean, comfortable, and effortlessly cool. Your new go-to footwear.' },
            { id: 5, name: 'Cashmere Wool Scarf', price: 75.00, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCJpa3UxJHfxeYaex2o28lrGrSXPQkKIlb7g&s', description: 'Stay warm and stylish with this luxuriously soft cashmere and wool blend scarf.' },
            { id: 6, name: 'Denim Trucker Jacket', price: 120.00, image: 'https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/31447573/2024/12/24/e76dade2-9149-4b10-9c57-4d502619b8f21735055180454-Style-Quotient-Men-Spread-Collar-Solid-Cotton-Casual-Denim-J-1.jpg', description: 'A rugged and timeless layering piece that only gets better with age.' },
            { id: 7, name: 'Modern Digital Watch', price: 180.00, image: 'https://images.stockcake.com/public/f/9/d/f9d07082-6ba3-440b-8e8f-62499c20b697_large/futuristic-digital-watch-stockcake.jpg', description: 'Sleek design meets smart functionality. Track time and stay connected.' },
            { id: 8, name: 'Canvas Backpack', price: 55.00, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRX2pcoCSCKGgqsshJyEJzkJenhHp9iUIS8-A&s', description: 'Durable and spacious, this backpack is perfect for daily commutes or weekend adventures.' },
        ];

        let cart = [];
        let orders = [];

        // --- CORE LOGIC ---

        document.addEventListener('DOMContentLoaded', () => {
            renderProducts();
            updateCartCount();
            setActiveLink('products');
        });
        
        function navigateTo(page) {
            document.querySelectorAll('.page-section').forEach(p => p.classList.add('hidden'));
            document.getElementById(`page-${page}`).classList.remove('hidden');
            setActiveLink(page);
            window.scrollTo(0, 0);

            if (page === 'cart') renderCart();
            if (page === 'orders') renderOrders();
        }

        function setActiveLink(page) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('nav-active', 'font-bold', 'text-indigo-600');
                if (link.dataset.page === page) {
                    link.classList.add('nav-active', 'font-bold', 'text-indigo-600');
                }
            });
        }
        
        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            const cartItem = cart.find(item => item.id === productId);

            if (cartItem) {
                cartItem.quantity++;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            updateCartCount();
            showToast("Item added to cart!");
        }

        function removeFromCart(productId) {
            cart = cart.filter(item => item.id !== productId);
            updateCartCount();
            renderCart();
        }

        function updateQuantity(productId, change) {
            const cartItem = cart.find(item => item.id === productId);
            if (cartItem) {
                cartItem.quantity += change;
                if (cartItem.quantity <= 0) {
                    removeFromCart(productId);
                } else {
                    renderCart();
                }
            }
            updateCartCount();
        }

        function updateCartCount() {
            const count = cart.reduce((sum, item) => sum + item.quantity, 0);
            document.getElementById('cart-item-count').textContent = count;
        }

        function getCartTotal() {
            return cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
        }

        function placeOrder(orderDetails) {
            const newOrder = {
                id: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                date: new Date().toLocaleString(),
                items: [...cart],
                total: getCartTotal(),
                customer: orderDetails,
            };
            orders.push(newOrder);
            cart = [];
            updateCartCount();
            renderOrderConfirmation(newOrder);
            navigateTo('order-confirmation');
        }

        // --- UI RENDERING ---

        function renderProducts() {
            const productList = document.getElementById('product-list');
            productList.innerHTML = products.map(product => `
                <div class="bg-white rounded-xl shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 group">
                    <div class="relative">
                        <img class="h-64 w-full object-cover" src="${product.image}" alt="${product.name}" onerror="this.src='https://placehold.co/400x400/e0e0e0/ffffff?text=Image+Error'">
                        <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                             <button onclick="addToCart(${product.id})" class="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold transform hover:scale-105 transition-transform duration-300">Add to Cart</button>
                        </div>
                    </div>
                    <div class="p-6">
                        <h3 class="text-lg font-semibold text-slate-800 truncate">${product.name}</h3>
                        <p class="text-sm text-slate-500 mt-1">${product.description.substring(0, 50)}...</p>
                        <p class="mt-4 text-xl font-bold text-indigo-600">$${product.price.toFixed(2)}</p>
                    </div>
                </div>
            `).join('');
        }

        function renderCart() {
            const cartView = document.getElementById('cart-view');
            if (cart.length === 0) {
                cartView.innerHTML = `
                    <div class="text-center bg-white p-10 rounded-lg shadow-md">
                        <i class="fa-solid fa-cart-arrow-down text-5xl text-slate-300 mb-4"></i>
                        <h2 class="text-2xl font-bold text-slate-800">Your cart is empty.</h2>
                        <p class="text-slate-500 mt-2">Looks like you haven't added anything to your cart yet.</p>
                        <button onclick="navigateTo('products')" class="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-300">Start Shopping</button>
                    </div>
                `;
                return;
            }

            const cartItemsHTML = cart.map(item => `
                <div class="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm mb-4">
                    <div class="flex items-center space-x-4">
                        <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-md">
                        <div>
                            <h3 class="font-semibold text-slate-800">${item.name}</h3>
                            <p class="text-slate-500 text-sm">$${item.price.toFixed(2)}</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <div class="flex items-center border rounded-md">
                            <button onclick="updateQuantity(${item.id}, -1)" class="px-3 py-1 text-slate-600 hover:bg-slate-100">-</button>
                            <span class="px-4 py-1">${item.quantity}</span>
                            <button onclick="updateQuantity(${item.id}, 1)" class="px-3 py-1 text-slate-600 hover:bg-slate-100">+</button>
                        </div>
                        <p class="w-24 text-right font-semibold text-slate-900">$${(item.price * item.quantity).toFixed(2)}</p>
                        <button onclick="removeFromCart(${item.id})" class="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            `).join('');

            cartView.innerHTML = `
                <h1 class="text-3xl font-bold tracking-tight text-slate-900 mb-6">Your Shopping Cart</h1>
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <div class="space-y-4">
                        ${cartItemsHTML}
                    </div>
                    <div class="mt-6 pt-6 border-t flex justify-end">
                        <div class="w-full max-w-sm">
                            <div class="flex justify-between text-lg font-semibold">
                                <span>Subtotal</span>
                                <span>$${getCartTotal()}</span>
                            </div>
                            <p class="text-slate-500 text-sm mt-1">Shipping and taxes calculated at checkout.</p>
                            <button onclick="renderCheckout()" class="w-full mt-4 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-300">Proceed to Checkout</button>
                        </div>
                    </div>
                </div>
            `;
        }

        function renderCheckout() {
            const checkoutPage = document.getElementById('page-checkout');
            checkoutPage.innerHTML = `
                <h1 class="text-3xl font-bold tracking-tight text-slate-900 mb-8 text-center">Checkout</h1>
                <div class="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <!-- Shipping Information -->
                    <div class="bg-white p-8 rounded-xl shadow-lg">
                        <h2 class="text-2xl font-semibold mb-6">Shipping Information</h2>
                        <form id="checkout-form" class="space-y-4">
                            <div>
                                <label for="name" class="block text-sm font-medium text-slate-600">Full Name</label>
                                <input type="text" id="name" name="name" required class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                            </div>
                             <div>
                                <label for="email" class="block text-sm font-medium text-slate-600">Email Address</label>
                                <input type="email" id="email" name="email" required class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                            </div>
                            <div>
                                <label for="address" class="block text-sm font-medium text-slate-600">Address</label>
                                <input type="text" id="address" name="address" required class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                            </div>
                             <!-- Mock Payment -->
                            <div class="pt-4">
                                <h3 class="text-lg font-semibold mb-2">Payment Details</h3>
                                <div class="bg-slate-50 p-4 rounded-md border border-slate-200">
                                    <p class="text-sm text-slate-600">This is a mock payment gateway. No real card is needed.</p>
                                    <div class="mt-2">
                                        <label for="card" class="block text-sm font-medium text-slate-600">Card Number</label>
                                        <input type="text" id="card" name="card" placeholder="**** **** **** 1234" class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm">
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    <!-- Order Summary -->
                    <div class="bg-white p-8 rounded-xl shadow-lg">
                         <h2 class="text-2xl font-semibold mb-6">Order Summary</h2>
                         <div class="space-y-3">
                            ${cart.map(item => `
                                <div class="flex justify-between items-center text-sm">
                                    <span class="text-slate-600">${item.name} (x${item.quantity})</span>
                                    <span class="font-medium">$${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            `).join('')}
                         </div>
                         <div class="mt-6 pt-6 border-t space-y-2">
                             <div class="flex justify-between text-sm">
                                <span class="text-slate-600">Subtotal</span>
                                <span class="font-medium">$${getCartTotal()}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-slate-600">Shipping</span>
                                <span class="font-medium">$0.00</span>
                            </div>
                            <div class="flex justify-between text-lg font-bold mt-2">
                                <span>Total</span>
                                <span>$${getCartTotal()}</span>
                            </div>
                         </div>
                         <button form="checkout-form" type="submit" class="w-full mt-8 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-300">Pay Now & Place Order</button>
                    </div>
                </div>
            `;
            navigateTo('checkout');
            document.getElementById('checkout-form').addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const orderDetails = Object.fromEntries(formData.entries());
                placeOrder(orderDetails);
            });
        }
        
        function renderOrderConfirmation(order) {
            const confirmationPage = document.getElementById('page-order-confirmation');
            confirmationPage.innerHTML = `
                <div class="max-w-2xl mx-auto text-center bg-white p-10 rounded-lg shadow-xl">
                    <i class="fa-solid fa-check-circle text-6xl text-green-500 mb-4"></i>
                    <h1 class="text-3xl font-bold text-slate-900">Order Confirmed!</h1>
                    <p class="text-slate-600 mt-2">Thank you for your purchase, ${order.customer.name}!</p>
                    <div class="mt-6 text-left bg-slate-50 p-6 rounded-md border">
                        <h3 class="font-semibold mb-4">Order Summary</h3>
                        <p class="flex justify-between"><strong>Order ID:</strong> <span>${order.id}</span></p>
                        <p class="flex justify-between"><strong>Date:</strong> <span>${order.date}</span></p>
                        <p class="flex justify-between"><strong>Total:</strong> <span class="font-bold text-indigo-600">$${order.total}</span></p>
                        <p class="mt-2">An email confirmation has been sent to ${order.customer.email}.</p>
                    </div>
                    <button onclick="navigateTo('products')" class="mt-8 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-300">Continue Shopping</button>
                </div>
            `;
        }

        function renderOrders() {
            const ordersList = document.getElementById('orders-list');
            if (orders.length === 0) {
                ordersList.innerHTML = `
                     <div class="text-center bg-white p-10 rounded-lg shadow-md">
                        <i class="fa-solid fa-receipt text-5xl text-slate-300 mb-4"></i>
                        <h2 class="text-2xl font-bold text-slate-800">No orders yet.</h2>
                        <p class="text-slate-500 mt-2">Your past orders will appear here.</p>
                        <button onclick="navigateTo('products')" class="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-300">Shop Now</button>
                    </div>
                `;
                return;
            }

            ordersList.innerHTML = orders.slice().reverse().map(order => `
                <div class="bg-white rounded-lg shadow-md overflow-hidden">
                    <div class="bg-slate-50 p-4 flex justify-between items-center border-b">
                        <div>
                            <p class="font-semibold">Order ID: <span class="text-indigo-600 font-mono text-sm">${order.id}</span></p>
                            <p class="text-sm text-slate-500">Placed on: ${order.date}</p>
                        </div>
                        <div class="text-right">
                           <p class="font-bold text-xl text-slate-800">$${order.total}</p>
                        </div>
                    </div>
                    <div class="p-4">
                        <h4 class="font-semibold mb-3">Items:</h4>
                        <div class="space-y-2">
                        ${order.items.map(item => `
                            <div class="flex items-center justify-between text-sm">
                                <div class="flex items-center space-x-3">
                                    <img src="${item.image}" class="w-12 h-12 rounded-md object-cover">
                                    <span>${item.name} <span class="text-slate-500">x${item.quantity}</span></span>
                                </div>
                                <span class="font-medium">$${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        `).join('')}
                        </div>
                    </div>
                </div>
            `).join('');
        }
        
        function showToast(message) {
            const toast = document.getElementById('toast-notification');
            toast.textContent = message;
            toast.classList.remove('translate-x-full');
            toast.classList.add('translate-x-0');
            setTimeout(() => {
                toast.classList.remove('translate-x-0');
                toast.classList.add('translate-x-full');
            }, 3000);
        }

    
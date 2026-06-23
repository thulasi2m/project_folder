<div class="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden p-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Register</h2>
    
    <?php if (isset($error)): ?>
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <?php echo htmlspecialchars($error); ?>
        </div>
    <?php endif; ?>
    
    <form method="POST" class="space-y-4">
        <div>
            <label for="username" class="block text-gray-700 font-medium mb-2">Username</label>
            <input type="text" id="username" name="username" required
                   class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
        </div>
        
        <div>
            <label for="password" class="block text-gray-700 font-medium mb-2">Password</label>
            <input type="password" id="password" name="password" required
                   class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
        </div>
        
        <div>
            <label for="confirm_password" class="block text-gray-700 font-medium mb-2">Confirm Password</label>
            <input type="password" id="confirm_password" name="confirm_password" required
                   class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
        </div>
        
        <div class="flex items-center justify-between">
            <button type="submit" class="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition">
                Register
            </button>
            <a href="?action=login" class="text-green-600 hover:underline">Login here</a>
        </div>
    </form>
</div>
<div class="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden p-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Set New Password</h2>
    
    <?php if (isset($error)): ?>
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <?php echo htmlspecialchars($error); ?>
        </div>
    <?php endif; ?>

    <?php if (isset($success)): ?>
        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <?php echo htmlspecialchars($success); ?>
        </div>
        <div class="text-center mt-4">
            <a href="?action=login" class="text-green-600 hover:underline">Back to Login</a>
        </div>
    <?php else: ?>
        <p class="text-gray-600 mb-4 text-sm text-center">Enter the OTP sent to <b><?php echo htmlspecialchars($_SESSION['reset_phone'] ?? ''); ?></b> and choose a new password. (For testing, the OTP is 123456).</p>
        
        <form method="POST" action="?action=forgot_password_reset" class="space-y-4">
            <div>
                <label for="otp" class="block text-gray-700 font-medium mb-2">Enter OTP</label>
                <input type="text" id="otp" name="otp" required placeholder="123456"
                       class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
            </div>
            
            <div>
                <label for="new_password" class="block text-gray-700 font-medium mb-2">New Password</label>
                <input type="password" id="new_password" name="new_password" required
                       class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
            </div>

            <div>
                <label for="confirm_password" class="block text-gray-700 font-medium mb-2">Confirm New Password</label>
                <input type="password" id="confirm_password" name="confirm_password" required
                       class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
            </div>
            
            <div class="flex flex-col items-center space-y-4">
                <button type="submit" class="w-full bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition">
                    Reset Password
                </button>
                <a href="?action=forgot_password_clear" class="text-sm text-green-600 hover:underline">Change Phone Number</a>
            </div>
        </form>
    <?php endif; ?>
</div>

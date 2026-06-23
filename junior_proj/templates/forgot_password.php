<div class="max-w-md mx-auto bg-[#f8f9fa] rounded-[2rem] shadow-xl overflow-hidden p-8 border-[8px] border-gray-800">
    <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Password Recovery</h2>
        <p class="text-gray-600 text-sm">Recover your account.</p>
    </div>

    <?php if (isset($error)): ?>
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            <?php echo htmlspecialchars($error); ?>
        </div>
    <?php endif; ?>

    <form method="POST" action="?action=forgot_password_reset" class="space-y-6">
        
        <!-- User Details Section -->
        <div>
            <div class="space-y-3">
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <input type="text" name="username" required placeholder="Username"
                           class="w-full pl-10 pr-4 py-3 border border-[#8b2323] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8b2323] bg-transparent">
                </div>

                <div class="relative flex">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                    </div>
                    <div class="flex items-center pl-10 pr-2 border-y border-l border-[#8b2323] rounded-l-lg bg-transparent">
                        <span class="text-gray-700 font-medium">+91</span>
                        <svg class="h-3 w-3 ml-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                    <input type="tel" name="phone" required placeholder="Phone Number"
                           class="w-full pl-3 pr-4 py-3 border border-[#8b2323] rounded-r-lg focus:outline-none focus:ring-1 focus:ring-[#8b2323] bg-transparent border-l-0">
                </div>
            </div>
        </div>

        <!-- Reset Password Section -->
        <div>
            <h3 class="text-sm font-bold text-gray-800 mb-3">Reset Password</h3>
            <div class="space-y-3">
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <input type="password" name="new_password" required placeholder="New Password"
                           class="w-full pl-10 pr-10 py-3 border border-[#2e7d32] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2e7d32] bg-transparent">
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg class="h-4 w-4 text-[#2e7d32]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>

                <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <input type="password" name="confirm_password" required placeholder="Confirm New Password"
                           class="w-full pl-10 pr-10 py-3 border border-[#2e7d32] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2e7d32] bg-transparent">
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg class="h-4 w-4 text-[#2e7d32]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="pt-2">
            <button type="submit" class="w-full bg-[#1e7b7e] text-white font-medium px-6 py-3 rounded-lg hover:bg-[#155d5f] transition shadow-md">
                Update Password
            </button>
        </div>
    </form>
    
    <div class="mt-6 text-right">
        <a href="?action=login" class="text-xs text-gray-500 hover:text-gray-800 underline">Return to Login</a>
    </div>
</div>

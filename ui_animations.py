"""
UI Animations Module
Reusable animation functions for smooth Tkinter transitions
"""

import math


# ============================================================
# EASING FUNCTIONS
# ============================================================

class Easing:
    """Easing functions for smooth animations"""
    
    @staticmethod
    def linear(t):
        """Linear easing (no acceleration)"""
        return t
    
    @staticmethod
    def ease_in_quad(t):
        """Quadratic ease-in (slow start)"""
        return t * t
    
    @staticmethod
    def ease_out_quad(t):
        """Quadratic ease-out (slow end)"""
        return t * (2 - t)
    
    @staticmethod
    def ease_in_out_quad(t):
        """Quadratic ease-in-out (slow start and end)"""
        if t < 0.5:
            return 2 * t * t
        return -1 + (4 - 2 * t) * t
    
    @staticmethod
    def ease_in_cubic(t):
        """Cubic ease-in"""
        return t * t * t
    
    @staticmethod
    def ease_out_cubic(t):
        """Cubic ease-out"""
        return 1 + (t - 1) ** 3
    
    @staticmethod
    def ease_in_out_cubic(t):
        """Cubic ease-in-out"""
        if t < 0.5:
            return 4 * t * t * t
        return 1 + (t - 1) * (2 * (t - 2)) ** 2
    
    @staticmethod
    def ease_out_elastic(t):
        """Elastic ease-out (spring effect)"""
        if t == 0 or t == 1:
            return t
        p = 0.3
        return math.pow(2, -10 * t) * math.sin((t - p / 4) * (2 * math.pi) / p) + 1
    
    @staticmethod
    def ease_out_back(t):
        """Back ease-out (slight overshoot)"""
        c1 = 1.70158
        c3 = c1 + 1
        return 1 + c3 * math.pow(t - 1, 3) + c1 * math.pow(t - 1, 2)


# ============================================================
# ANIMATION HELPERS
# ============================================================

class AnimationHelper:
    """Helper class for creating smooth animations"""
    
    @staticmethod
    def fade_in(widget, duration=250, easing=None, callback=None):
        """
        Fade in a widget by animating its alpha/opacity
        
        Args:
            widget: The widget to animate
            duration: Animation duration in milliseconds
            easing: Easing function (default: ease_out_quad)
            callback: Function to call when animation completes
        """
        if easing is None:
            easing = Easing.ease_out_quad
        
        start_time = [0]  # Mutable to track in closure
        
        def animate():
            if start_time[0] == 0:
                start_time[0] = widget.winfo_toplevel().tk.call('clock', 'milliseconds')
            
            current_time = widget.winfo_toplevel().tk.call('clock', 'milliseconds')
            elapsed = current_time - start_time[0]
            progress = min(elapsed / duration, 1.0)
            
            # Apply easing
            eased_progress = easing(progress)
            
            # Note: CustomTkinter doesn't support direct alpha, 
            # so we'll use a workaround with color interpolation
            # This is a placeholder - actual implementation may vary
            
            if progress < 1.0:
                widget.after(16, animate)  # ~60fps
            else:
                if callback:
                    callback()
        
        animate()
    
    @staticmethod
    def fade_out(widget, duration=250, easing=None, callback=None):
        """
        Fade out a widget
        
        Args:
            widget: The widget to animate
            duration: Animation duration in milliseconds
            easing: Easing function (default: ease_in_quad)
            callback: Function to call when animation completes
        """
        if easing is None:
            easing = Easing.ease_in_quad
        
        start_time = [0]
        
        def animate():
            if start_time[0] == 0:
                start_time[0] = widget.winfo_toplevel().tk.call('clock', 'milliseconds')
            
            current_time = widget.winfo_toplevel().tk.call('clock', 'milliseconds')
            elapsed = current_time - start_time[0]
            progress = min(elapsed / duration, 1.0)
            
            eased_progress = easing(progress)
            
            if progress < 1.0:
                widget.after(16, animate)
            else:
                if callback:
                    callback()
        
        animate()
    
    @staticmethod
    def slide_in(widget, direction='left', duration=300, easing=None, callback=None):
        """
        Slide in a widget from a direction
        
        Args:
            widget: The widget to animate
            direction: 'left', 'right', 'top', or 'bottom'
            duration: Animation duration in milliseconds
            easing: Easing function (default: ease_out_cubic)
            callback: Function to call when animation completes
        """
        if easing is None:
            easing = Easing.ease_out_cubic
        
        # Get initial position
        initial_x = widget.winfo_x()
        initial_y = widget.winfo_y()
        
        # Calculate start position based on direction
        if direction == 'left':
            start_x = -widget.winfo_width()
            start_y = initial_y
        elif direction == 'right':
            start_x = widget.winfo_toplevel().winfo_width()
            start_y = initial_y
        elif direction == 'top':
            start_x = initial_x
            start_y = -widget.winfo_height()
        else:  # bottom
            start_x = initial_x
            start_y = widget.winfo_toplevel().winfo_height()
        
        start_time = [0]
        
        def animate():
            if start_time[0] == 0:
                start_time[0] = widget.winfo_toplevel().tk.call('clock', 'milliseconds')
            
            current_time = widget.winfo_toplevel().tk.call('clock', 'milliseconds')
            elapsed = current_time - start_time[0]
            progress = min(elapsed / duration, 1.0)
            
            eased_progress = easing(progress)
            
            # Interpolate position
            current_x = start_x + (initial_x - start_x) * eased_progress
            current_y = start_y + (initial_y - start_y) * eased_progress
            
            widget.place(x=current_x, y=current_y)
            
            if progress < 1.0:
                widget.after(16, animate)
            else:
                if callback:
                    callback()
        
        animate()
    
    @staticmethod
    def pulse(widget, scale_factor=1.05, duration=200, easing=None):
        """
        Create a pulse effect (scale up and down)
        
        Args:
            widget: The widget to animate
            scale_factor: How much to scale (1.05 = 5% larger)
            duration: Duration of one pulse cycle in milliseconds
            easing: Easing function (default: ease_in_out_quad)
        """
        if easing is None:
            easing = Easing.ease_in_out_quad
        
        # This is a simplified version - actual scaling in Tkinter is complex
        # We'll use a color pulse instead for CustomTkinter compatibility
        pass
    
    @staticmethod
    def interpolate_color(color1, color2, progress):
        """
        Interpolate between two hex colors
        
        Args:
            color1: Start color (hex string)
            color2: End color (hex string)
            progress: Progress from 0.0 to 1.0
        
        Returns:
            Interpolated color as hex string
        """
        # Remove '#' if present
        c1 = color1.lstrip('#')
        c2 = color2.lstrip('#')
        
        # Convert to RGB
        r1, g1, b1 = int(c1[0:2], 16), int(c1[2:4], 16), int(c1[4:6], 16)
        r2, g2, b2 = int(c2[0:2], 16), int(c2[2:4], 16), int(c2[4:6], 16)
        
        # Interpolate
        r = int(r1 + (r2 - r1) * progress)
        g = int(g1 + (g2 - g1) * progress)
        b = int(b1 + (b2 - b1) * progress)
        
        # Convert back to hex
        return f"#{r:02x}{g:02x}{b:02x}"


# ============================================================
# HOVER ANIMATION CLASS
# ============================================================

class HoverAnimation:
    """Class to handle hover animations on widgets"""
    
    def __init__(self, widget, hover_color, normal_color, duration=150):
        """
        Initialize hover animation
        
        Args:
            widget: The widget to animate
            hover_color: Color when hovered
            normal_color: Normal color
            duration: Transition duration in milliseconds
        """
        self.widget = widget
        self.hover_color = hover_color
        self.normal_color = normal_color
        self.duration = duration
        self.is_hovering = False
        self.animation_id = None
        
        # Bind events
        widget.bind("<Enter>", self._on_enter)
        widget.bind("<Leave>", self._on_leave)
    
    def _on_enter(self, event):
        """Handle mouse enter"""
        self.is_hovering = True
        self._animate_to_hover()
    
    def _on_leave(self, event):
        """Handle mouse leave"""
        self.is_hovering = False
        self._animate_to_normal()
    
    def _animate_to_hover(self):
        """Animate to hover state"""
        start_time = [0]
        
        def animate():
            if start_time[0] == 0:
                start_time[0] = self.widget.winfo_toplevel().tk.call('clock', 'milliseconds')
            
            current_time = self.widget.winfo_toplevel().tk.call('clock', 'milliseconds')
            elapsed = current_time - start_time[0]
            progress = min(elapsed / self.duration, 1.0)
            
            # Apply easing
            eased_progress = Easing.ease_out_quad(progress)
            
            # Interpolate color
            current_color = AnimationHelper.interpolate_color(
                self.normal_color, self.hover_color, eased_progress
            )
            
            try:
                self.widget.configure(fg_color=current_color)
            except:
                pass
            
            if progress < 1.0 and self.is_hovering:
                self.animation_id = self.widget.after(16, animate)
        
        if self.animation_id:
            self.widget.after_cancel(self.animation_id)
        animate()
    
    def _animate_to_normal(self):
        """Animate to normal state"""
        start_time = [0]
        
        def animate():
            if start_time[0] == 0:
                start_time[0] = self.widget.winfo_toplevel().tk.call('clock', 'milliseconds')
            
            current_time = self.widget.winfo_toplevel().tk.call('clock', 'milliseconds')
            elapsed = current_time - start_time[0]
            progress = min(elapsed / self.duration, 1.0)
            
            eased_progress = Easing.ease_in_quad(progress)
            
            current_color = AnimationHelper.interpolate_color(
                self.hover_color, self.normal_color, eased_progress
            )
            
            try:
                self.widget.configure(fg_color=current_color)
            except:
                pass
            
            if progress < 1.0 and not self.is_hovering:
                self.animation_id = self.widget.after(16, animate)
        
        if self.animation_id:
            self.widget.after_cancel(self.animation_id)
        animate()

// Presentation JavaScript - Navigation and Charts

class Presentation {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 12;
        this.slides = document.querySelectorAll('.slide');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentSlideElement = document.getElementById('currentSlide');
        
        this.init();
    }

    init() {
        // Initialize navigation
        this.setupNavigation();
        this.updateSlideCounter();
        this.updateButtonStates();
        
        // Initialize charts
        this.initCharts();
        
        // Set up keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyNavigation(e));
    }

    setupNavigation() {
        // Remove any existing event listeners and add new ones
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.previousSlide();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.nextSlide();
            });
        }
    }

    handleKeyNavigation(e) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            this.previousSlide();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            this.nextSlide();
        }
    }

    goToSlide(slideNumber) {
        if (slideNumber < 1 || slideNumber > this.totalSlides) return;

        // Hide all slides
        this.slides.forEach(slide => {
            slide.classList.remove('active');
        });

        // Show target slide
        const targetSlide = document.querySelector(`[data-slide="${slideNumber}"]`);
        if (targetSlide) {
            targetSlide.classList.add('active');
            this.currentSlide = slideNumber;
            this.updateSlideCounter();
            this.updateButtonStates();
            
            // Trigger chart refresh if needed
            if (slideNumber === 3) {
                setTimeout(() => this.refreshNewspaperChart(), 100);
            } else if (slideNumber === 5) {
                setTimeout(() => this.refreshSocialMediaChart(), 100);
            }
        }
    }

    previousSlide() {
        if (this.currentSlide > 1) {
            this.goToSlide(this.currentSlide - 1);
        }
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.goToSlide(this.currentSlide + 1);
        }
    }

    updateSlideCounter() {
        if (this.currentSlideElement) {
            this.currentSlideElement.textContent = this.currentSlide;
        }
    }

    updateButtonStates() {
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentSlide === 1;
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentSlide === this.totalSlides;
        }
    }

    initCharts() {
        // Wait for Chart.js to load
        if (typeof Chart === 'undefined') {
            setTimeout(() => this.initCharts(), 100);
            return;
        }

        // Create charts immediately
        setTimeout(() => {
            this.createNewspaperChart();
            this.createSocialMediaChart();
        }, 200);
    }

    refreshNewspaperChart() {
        // Destroy existing chart if it exists
        const ctx = document.getElementById('newspaperChart');
        if (ctx && ctx.chart) {
            ctx.chart.destroy();
        }
        this.createNewspaperChart();
    }

    refreshSocialMediaChart() {
        // Destroy existing chart if it exists
        const ctx = document.getElementById('socialMediaChart');
        if (ctx && ctx.chart) {
            ctx.chart.destroy();
        }
        this.createSocialMediaChart();
    }

    createNewspaperChart() {
        const ctx = document.getElementById('newspaperChart');
        if (!ctx) return;

        const newspaperData = [
            { name: "Yomiuri", circulation: 5.85, stance: "Conservative" },
            { name: "Asahi", circulation: 3.39, stance: "Center-left" },
            { name: "Mainichi", circulation: 3.3, stance: "Centrist" },
            { name: "Nikkei", circulation: 2.77, stance: "Business" },
            { name: "Sankei", circulation: 1.6, stance: "Conservative" }
        ];

        const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'];

        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: newspaperData.map(item => item.name),
                datasets: [{
                    data: newspaperData.map(item => item.circulation),
                    backgroundColor: colors,
                    borderWidth: 3,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 12,
                                weight: 'bold'
                            },
                            color: '#134252',
                            generateLabels: function(chart) {
                                const original = Chart.defaults.plugins.legend.labels.generateLabels;
                                const labels = original.call(this, chart);
                                
                                labels.forEach((label, index) => {
                                    label.text = `${newspaperData[index].name} (${newspaperData[index].circulation}M)`;
                                });
                                
                                return labels;
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(19, 66, 82, 0.9)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#1FB8CD',
                        borderWidth: 2,
                        callbacks: {
                            label: function(context) {
                                const newspaper = newspaperData[context.dataIndex];
                                return `${newspaper.name}: ${newspaper.circulation}M readers (${newspaper.stance})`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 1000
                }
            }
        });

        // Store chart reference for cleanup
        ctx.chart = chart;
    }

    createSocialMediaChart() {
        const ctx = document.getElementById('socialMediaChart');
        if (!ctx) return;

        const socialMediaData = [
            { platform: "LINE", users: 97, type: "Messaging" },
            { platform: "YouTube", users: 78.7, type: "Video" },
            { platform: "X (Twitter)", users: 67, type: "Microblogging" },
            { platform: "Instagram", users: 57.5, type: "Photo/Video" },
            { platform: "TikTok", users: 26.9, type: "Short Video" },
            { platform: "Facebook", users: 26, type: "Social Network" }
        ];

        const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545'];

        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: socialMediaData.map(item => item.platform),
                datasets: [{
                    label: 'Users (Millions)',
                    data: socialMediaData.map(item => item.users),
                    backgroundColor: colors,
                    borderColor: colors.map(color => color + '80'),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Users (Millions)',
                            color: '#134252',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: 'rgba(19, 66, 82, 0.1)'
                        },
                        ticks: {
                            color: '#134252'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Social Media Platforms',
                            color: '#134252',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#134252',
                            maxRotation: 45
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(19, 66, 82, 0.9)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#1FB8CD',
                        borderWidth: 2,
                        callbacks: {
                            label: function(context) {
                                const platform = socialMediaData[context.dataIndex];
                                return `${platform.platform}: ${platform.users}M users (${platform.type})`;
                            }
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutBounce'
                }
            }
        });

        // Store chart reference for cleanup
        ctx.chart = chart;
    }
}

// Global presentation instance
let presentationInstance = null;

// Initialize presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a moment to ensure all elements are loaded
    setTimeout(() => {
        presentationInstance = new Presentation();
        
        // Make it globally accessible for debugging
        window.presentation = presentationInstance;
        
        console.log('Presentation initialized successfully');
    }, 100);
});

// Add entrance animations
document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all slide content for animation
    document.querySelectorAll('.slide-content').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Immediately show the first slide
    setTimeout(() => {
        const firstSlideContent = document.querySelector('.slide.active .slide-content');
        if (firstSlideContent) {
            firstSlideContent.style.opacity = '1';
            firstSlideContent.style.transform = 'translateY(0)';
        }
    }, 50);
});
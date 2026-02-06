import { Link } from '@inertiajs/react';
import { Facebook, Instagram, Youtube, MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const navigationLinks = [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About' },
        { href: '/products', label: 'Products' },
        { href: '/contact', label: 'Contact' },
    ];

    const socialLinks = [
        { href: '#', label: 'Facebook', icon: Facebook },
        { href: '#', label: 'Instagram', icon: Instagram },
        { href: '#', label: 'YouTube', icon: Youtube },
    ];

    return (
        <footer className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white">
            <div className="mx-auto max-w-7xl px-6 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    
                    {/* Brand / About Section */}
                    <div className="space-y-4">
                        <h4 className="text-xl font-bold mb-3 text-white dark:text-gray-100">EduFit</h4>
                        <p className="text-emerald-50/90 dark:text-gray-300 text-sm leading-relaxed">
                            EduFit provides quality school and university uniforms with
                            customization options, making ordering simple and reliable.
                        </p>
                        <div className="flex gap-4 pt-2">
                            {socialLinks.map((social) => {
                                const IconComponent = social.icon;
                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 dark:bg-gray-700 dark:hover:bg-gray-600 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                                        aria-label={social.label}
                                    >
                                        <IconComponent className="w-5 h-5" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Links Section */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-white dark:text-gray-100">Quick Links</h4>
                        <ul className="space-y-2.5">
                            {navigationLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-emerald-50/80 dark:text-gray-300 text-sm hover:text-white dark:hover:text-gray-100 hover:pl-2 transition-all duration-300 inline-block group"
                                    >
                                        <span className="group-hover:underline underline-offset-4">
                                            {link.label}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Information Section */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-white dark:text-gray-100">Contact Us</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-emerald-50/80 dark:text-gray-300 text-sm hover:text-white dark:hover:text-gray-100 transition-colors duration-300">
                                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span>U Lay Gyi School Uniform, Yangon, Myanmar</span>
                            </li>
                            <li className="flex items-center gap-3 text-emerald-50/80 dark:text-gray-300 text-sm hover:text-white dark:hover:text-gray-100 transition-colors duration-300">
                                <Phone className="w-5 h-5 flex-shrink-0" />
                                <a href="tel:+959123456789" className="hover:underline underline-offset-4">
                                    +959 123 456 789
                                </a>
                            </li>
                            <li className="flex items-center gap-3 text-emerald-50/80 dark:text-gray-300 text-sm hover:text-white dark:hover:text-gray-100 transition-colors duration-300">
                                <Mail className="w-5 h-5 flex-shrink-0" />
                                <a href="mailto:info@edufit.com" className="hover:underline underline-offset-4">
                                    info@edufit.com
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Map Section */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-white dark:text-gray-100">Visit Our Store</h4>
                        <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 border-2 border-white/10 hover:border-white/30 dark:border-gray-700 dark:hover:border-gray-600">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3819.465990956421!2d96.17264211519559!3d16.803223188431165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30c1ed7549bd35d7%3A0xcc2b4e3deadc6cfb!2sU%20Lay%20Gyu%20School%20Uniform!5e0!3m2!1sen!2smm!4v1675053182551!5m2!1sen!2smm"
                                className="w-full h-36"
                                loading="lazy"
                                allowFullScreen
                                referrerPolicy="no-referrer-when-downgrade"
                                title="EduFit Store Location"
                            />
                        </div>
                    </div>

                </div>

              
            </div>

            {/* Bottom Bar */}
            <div className="bg-emerald-900/50 dark:bg-gray-950/50 backdrop-blur-sm">
                <div className="mx-auto max-w-7xl px-6 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-emerald-100/80 dark:text-gray-400 text-sm">
                        <p>© {currentYear} EduFit. All rights reserved.</p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-white dark:hover:text-gray-200 transition-colors duration-300 hover:underline underline-offset-4">
                                Privacy Policy
                            </a>
                            <a href="#" className="hover:text-white dark:hover:text-gray-200 transition-colors duration-300 hover:underline underline-offset-4">
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

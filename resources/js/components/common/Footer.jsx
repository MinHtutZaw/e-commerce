

export default function Footer() {
    return (
        <>
            <footer className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white py-7">
                <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">

                    {/* Brand / About */}
                    <div>
                        <h4 className="text-lg font-semibold mb-2">EduFit</h4>
                        <p className="text-emerald-100 text-sm leading-relaxed">
                            EduFit provides quality school and university uniforms with
                            customization options, making ordering simple and reliable.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
                        <ul className="space-y-1 text-emerald-100 text-sm">
                            <li><a href="/" className="hover:text-white">Home</a></li>
                            <li><a href="/about" className="hover:text-white">About</a></li>
                            <li><a href="/products" className="hover:text-white">Products</a></li>
                            <li><a href="/contact" className="hover:text-white">Contact</a></li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="text-lg font-semibold mb-2">Follow Us</h4>
                        <ul className="space-y-1 text-emerald-100 text-sm">
                            <li><a href="#" className="hover:text-white">Facebook</a></li>
                            <li><a href="#" className="hover:text-white">Instagram</a></li>
                            <li><a href="#" className="hover:text-white">YouTube</a></li>
                        </ul>
                    </div>

                    {/* Contact / Map */}
                    <div>
                        <h4 className="text-lg font-semibold mb-2">Visit Us</h4>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3819.465990956421!2d96.17264211519559!3d16.803223188431165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30c1ed7549bd35d7%3A0xcc2b4e3deadc6cfb!2sU%20Lay%20Gyu%20School%20Uniform!5e0!3m2!1sen!2smm!4v1675053182551!5m2!1sen!2smm"
                            className="w-full h-28 rounded-lg border-0"
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="mt-6 border-t border-emerald-500/30 pt-3 text-center text-xs text-emerald-100">
                    © {new Date().getFullYear()} EduFit. All rights reserved.
                </div>
            </footer>


        </>
    )
}

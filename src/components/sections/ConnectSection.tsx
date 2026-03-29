import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import HCaptcha from "@hcaptcha/react-hcaptcha";

// Sanitize input — strip HTML tags, trim whitespace
import type {FormErrors, FormData, FormStatus} from "../../types.ts";
import {AnimatePresence, motion} from "framer-motion";

function sanitize(value: string): string {
    return value
        .replace(/<[^>]*>/g, '')   // strip HTML tags
        .replace(/[<>'"]/g, '')    // strip remaining dangerous chars
        .trim();
}

// Validate all fields, return errors object
function validate(formData: FormData): FormErrors {
    const errors: FormErrors = {};

    if (!formData.name || formData.name.length < 2) {
        errors.name = 'Name must be at least 2 characters.';
    }

    if (!formData.name || formData.name.length > 25) {
        errors.name = 'Name must be less than 25 characters.';
    }
    if (!formData.subject || formData.subject.length < 10) {
        errors.subject = 'Subject must be at least 10 characters.';
    }

    if (formData.subject && formData.subject.length > 40) {
        errors.subject = 'Subject cannot exceed 40 characters.';
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
        errors.email = 'Please enter a valid email address.';
    }

    if (!formData.message || formData.message.length < 10) {
        errors.message = 'Message must be at least 10 characters.';
    }

    if (formData.message && formData.message.length > 1000) {
        errors.message = 'Message cannot exceed 1000 characters.';
    }

    return errors;
}
export default function ConnectSection() {
    const form = useRef<HTMLFormElement>(null);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        subject: '',
        email: '',
        message: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [status, setStatus] = useState<FormStatus>('idle');

    const captchaRef = useRef<HCaptcha>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for field as user types
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        // Sanitize inputs
        const sanitized: FormData = {
            name: sanitize(formData.name),
            subject: sanitize(formData.subject),
            email: sanitize(formData.email),
            message: sanitize(formData.message).slice(0, 1000),
        };
        console.log(sanitized);

        // Validate
        const validationErrors = validate(sanitized);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Check captcha
        if (!captchaToken) {
            setErrors(prev => ({ ...prev }));
            return;
        }

        setStatus('sending');
        if (!form.current) return;

        try {
            await emailjs.sendForm(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_SEND_EMAIL_TEMPLATE_ID,
                form.current,
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
            );

            await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_AUTO_REPLY_TEMPLATE_ID,
                {
                    name: sanitized.name,
                    subject: sanitized.subject,
                    email: sanitized.email,
                    message: sanitized.message,
                },
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY

            );

            setStatus('success');
            setFormData({ name: '', subject: '', email: '', message: '' });
            setCaptchaToken(null);
            captchaRef.current?.resetCaptcha();

        } catch (error) {
            console.error('EmailJS error:', error);
            setStatus('error');
        }
    };

    const inputClass = (field: keyof FormErrors) => `
        px-4 py-2 rounded-lg text-sm font-primary
        bg-transparent border transition-colors outline-none
        text-vintage-lavender-300 placeholder-vintage-lavender-600
        ${errors[field]
        ? 'border-red-400 focus:border-red-300'
        : 'border-vintage-lavender-600 focus:border-vintage-lavender-400'
    }
    `;



    return (
        <div className="flex flex-col gap-6 pt-5" >
            <p className="flex text-vintage-lavender-300 font-primary">
                Thanks for spending time here! If something here resonated with you, please reach out via the form or find me on LinkedIn. If you think I would be a good fit for your team, take a look at my resume. If you are looking for an adventure, or friend I am here to talk!
            </p>
            {/*  LinkedIn + Resume  */}
            <div className="flex flex-row gap-4 items-center">
                <a
                    href="https://www.linkedin.com/in/kendra-lamb/"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2"
                >
                    <img
                        src="/InBug-White.png"
                        alt="linked-in-logo"
                        className="w-10 h-10 object-cover"
                    />
                </a>
                <a
                    href="/Riley_Resume.pdf"
                    download
                    className="flex items-center justify-center
                                border rounded-lg px-2 py-1
                               border-vintage-lavender-400
                               text-vintage-lavender-400
                               text-sm h-8
                               hover:text-vintage-lavender-200
                               hover:border-vintage-lavender-200
                               hover:shadow-sm
                               hover:-translate-y-2
                               hover:shadow-vintage-lavender-200"
                >
                    Download Resume
                </a>
            </div>
            <div>
                {/*  Contact form  */}
                <form ref={form} onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
                    <div className="flex flex-row gap-10">
                        {/*  Name  */}
                        <div className="flex flex-col gap-1 w-1/2">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your name"
                                maxLength={25}
                                className={inputClass('name')}
                            />

                            {errors.name && (
                                <p className="text-xs text-red-400 font-primary">{errors.name}</p>
                            )}
                        </div>
                        {/*  Email  */}
                        <div className="flex flex-col gap-1 w-1/2">

                            <input
                                type="text"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Your email"
                                maxLength={50}
                                className={inputClass('email')}
                            />

                            {errors.email && (
                                <p className="text-xs text-red-400 font-primary">{errors.email}</p>
                            )}
                        </div>
                    </div>

                    {/*  Subject  */}
                    <div className="flex flex-col gap-1 w-full">

                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Subject"
                            maxLength={40}
                            className={inputClass('subject')}
                        />

                        {errors.subject && (
                            <p className="text-xs text-red-400 font-primary">{errors.subject}</p>
                        )}
                    </div>
                    {/* Message */}
                    <div className="flex flex-col gap-1">
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="What's on your mind?"
                            rows={5}
                            maxLength={1000}
                            className={inputClass('message')}
                        />
                        <div className="flex justify-between">
                            {errors.message
                                ? <p className="text-xs text-red-400 font-primary">{errors.message}</p>
                                : <span />
                            }

                            {(formData.message.length < 10) && (
                                <p className="text-sm text-red-400 font-primary">
                                    {formData.message.length}/1000
                                </p>
                            )}
                            {(formData.message.length >= 10) && (
                                <p className="text-xs text-vintage-lavender-600 font-primary">
                                    {formData.message.length}/1000
                                </p>
                            )}

                        </div>
                    </div>

                    {/* hCaptcha */}
                    <HCaptcha
                        ref={captchaRef}
                        sitekey={import.meta.env.VITE_HCAPTCHA_SITE_KEY}
                        onVerify={(token) => setCaptchaToken(token)}
                        onExpire={() => setCaptchaToken(null)}
                        theme="dark"
                    />
                    {/*{!captchaToken && status !== 'idle' && (*/}
                    {/*    <p className="text-xs text-red-400 font-primary">*/}
                    {/*        Please complete the captcha.*/}
                    {/*    </p>*/}
                    {/*)}*/}

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={status === 'sending'}
                        className="px-6 py-2 rounded-lg border border-vintage-lavender-600
                               text-sm font-primary text-vintage-lavender-300
                               hover:border-vintage-lavender-400 hover:text-vintage-lavender-400
                               transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {status === 'sending' ? 'Sending...' : 'Send Message'}
                    </button>


                    {/* Success / error feedback */}
                    <AnimatePresence>
                        {status === 'success' && (
                            <motion.p
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="text-sm font-primary text-vintage-lavender-400"
                            >
                                Message sent! I will get back to you soon.
                            </motion.p>
                        )}
                        {status === 'error' && (
                            <motion.p
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="text-sm font-primary text-red-400"
                            >
                                Something went wrong. Please try again or reach out on LinkedIn.
                            </motion.p>
                        )}
                    </AnimatePresence>
                </form>
            </div>
        </div>
    )
}
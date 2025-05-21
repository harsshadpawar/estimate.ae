import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            nav: {
                home: 'HOME',
                about: 'ABOUT US',
                faq: 'FAQ',
                contact: 'CONTACT US',
                signup: 'SIGNUP',
                login: 'LOGIN',
            },
            home: {
                home_heading_line1: 'Transform Your',
                home_heading_highlight: 'CNC Cost Estimation',
                home_heading_line2: '— Get Accurate',
                home_heading_line3: 'Quotes in Seconds',
                get_started: 'GET STARTED',
            },
            about: {
                about_welcome: '— WELCOME',
                about_heading: 'About Us',
                about_content: 'Welcome to Estimate.ae, the ultimate platform for instant and reliable CNC cost estimation.Whether you re working with turned parts, milled components, or sheet metal fabrications,our state-of-the-art software empowers you to calculate accurate machining costs online - in just a matter of seconds. Simply register and upload your 3D design files to experience automated geometry recognition, optimized manufacturing process selection, and highly customizable calculation parameters.'
            },
            benefits: {
                benefits: "Key Benefits",
                benefit1: {
                    title: 'Instant CNC Quotes',
                    description:
                        'Get real-time pricing for turned, milled, and sheet metal parts, minimizing guesswork and improving your bottom line.',
                },
                benefit2: {
                    title: 'Automatic Geometry Recognition',
                    description:
                        'Our system quickly identifies part features and selects the optimal machines and processes, saving you hours of manual work.',
                },
                benefit3: {
                    title: 'Customizable Parameters',
                    description:
                        'Adjust feed rates, material selections, and tooling options to fine-tune your cost calculations and achieve the perfect balance of price and performance.',
                },
                benefit4: {
                    title: 'Traffic Light Indicators for Cost Savings',
                    description:
                        'Our intuitive "traffic light" color system instantly highlights areas of greatest savings potential, helping you optimize production strategies at a glance.',
                },
                benefit5: {
                    title: 'Upload Your Own Raw Parts',
                    description:
                        'Easily import your preferred raw materials and let our tool compute the differential volume, ensuring precise, transparent cost breakdowns.',
                },
            },
            features: {
                features: "Features",
                Comprehensive: "Comprehensive",
                machinesetup: "Machine Setup",
                Reports: "Reports",
                content: "Receive detailed insights into tooling, cycle times, and machining operations, ensuring maximum efficiency at every stage of production.",
                content1: "CNC",
                content2: "code Generation",
                fortoolpath: "for Toolpaths",
                content3: "Avoid costly mistakes and maximize profits with our AI-powered expertise. Our system identifies technical limitations and manufacturing challenges that could impact your production efficiency or profitability.",
                content4: "User-Friendly",
                content5: "Interface",
                content6: "Enjoy an intuitive platform designed for ease of use, supporting popular file formats like STEP, STL, and more—no steep learning curve required.",
                content7: "Streamlined Process",
                content8: "Optimization",
                content9: "From estimation to execution, our automated workflows help you reduce overhead, boost productivity, and maintain exceptional quality control"
            },
            testimonials: {
                heading: "TESTIMONIALS",
                subheading: "What Customers Say",
                list: [
                    {
                        name: "John D.",
                        subtitle: "Lorem Ipsum is simply",
                        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry...",
                    },
                    {
                        name: "Jane A.",
                        subtitle: "Printing and Typesetting",
                        description: "It has survived not only five centuries, but also the leap into electronic typesetting...",
                    },
                    {
                        name: "Mark R.",
                        subtitle: "Typesetting Industry",
                        description: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum...",
                    },
                    {
                        name: "Anna B.",
                        subtitle: "Lorem Ipsum Text",
                        description: "More recently with desktop publishing software like Aldus PageMaker including versions...",
                    }
                ]
            },
            faq: {
                "title": "FAQs",
                "subtitle": "Frequently Asked Questions",
                "list": [
                    {
                        "question": "Lorem Ipsum is simply dummy text of the printing",
                        "answer": "Lorem Ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua..."
                    },
                    {
                        "question": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
                        "answer": "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s..."
                    },
                    {
                        "question": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
                        "answer": "It has survived not only five centuries, but also the leap into electronic typesetting..."
                    },
                    {
                        "question": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
                        "answer": "It has survived not only five centuries, but also the leap into electronic typesetting..."
                    }
                ]

            },
            cardbox: {
                "title": "Ready to Optimize Your CNC Production? Use QR Code scan and route this to our Registration Page.",
                "description": "Test our platform now without registration. Upload your part designs, adjust your parameters, and start saving time and money today. For personalized guidance or more information, feel free to Contact Us or Register for a free trial.",
                "contact": "CONTACT US",
                "register": "REGISTER NOW"
            },
            footer: {
                text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the",
                usefullinks: "USEFUL LINKS",
                aboutus: "About Us",
                contactus: "Contact Us",
                faq: "FAQ",
                helpandsuppport: "Help & Support",
                privacy: "Privacy Policy",
                terms: "Terms of Service",
                touch: "GET IN TOUCH WITH US",
                email: "Email",
                phone: "Phone",
                rights: "© 2025 Estimate.ae"
            }
        },
    },
    ar: {
        translation: {
            nav: {
                home: 'الرئيسية',
                about: 'من نحن',
                faq: 'الأسئلة الشائعة',
                contact: 'اتصل بنا',
                signup: 'إنشاء حساب',
                login: 'تسجيل الدخول',
            },
            home: {
                home_heading_line1: 'حوّل',
                home_heading_highlight: 'تقدير تكلفة CNC',
                home_heading_line2: '- احصل على الدقة',
                home_heading_line3: 'اقتباسات في ثوان',
                get_started: 'ابدأ الآن',
            },
            about: {
                about_welcome: '- مرحباً',
                about_heading: 'معلومات عنا',
                about_content: 'مرحبًا بكم في Estimate.ae، المنصة الأمثل لتقدير تكاليف آلات التحكم الرقمي بالحاسوب (CNC) بشكل فوري وموثوق. سواء كنت تعمل على قطع مخروطة، أو مكونات مفرومة، أو تصنيع صفائح معدنية، فإن برنامجنا المتطور يُمكّنك من حساب تكاليف التشغيل بدقة عبر الإنترنت - في ثوانٍ معدودة. ما عليك سوى التسجيل وتحميل ملفات التصميم ثلاثية الأبعاد لتجربة التعرف الآلي على الأشكال الهندسية، واختيار عملية تصنيع مُحسّنة، ومعاملات حسابية قابلة للتخصيص بدرجة عالية.'
            },
            benefits: {
                benefits: "الفوائد الرئيسية",
                benefit1: {
                    title: 'عروض أسعار CNC الفورية',
                    description:
                        'احصل على تسعير فوري للأجزاء المخرطة والمطحونة والمصنوعة من الصفائح المعدنية، مما يقلل من التخمين ويحسن أرباحك.',
                },
                benefit2: {
                    title: 'التعرف التلقائي على الهندسة',
                    description:
                        'نظامنا يحدد ميزات الجزء بسرعة ويختار الآلات والعمليات المثالية، مما يوفر لك ساعات من العمل اليدوي.',
                },
                benefit3: {
                    title: 'معلمات قابلة للتخصيص',
                    description:
                        'قم بضبط معدلات التغذية، واختيار المواد، وخيارات الأدوات بدقة لتحسين حسابات التكلفة وتحقيق التوازن المثالي بين السعر والأداء.',
                },
                benefit4: {
                    title: 'مؤشرات ضوئية لتوفير التكاليف',
                    description:
                        'يُظهر نظام الألوان البديهي الخاص بنا المناطق ذات إمكانيات التوفير القصوى فورًا، مما يساعدك على تحسين استراتيجيات الإنتاج بسرعة.',
                },
                benefit5: {
                    title: 'تحميل الأجزاء الخام الخاصة بك',
                    description:
                        'قم باستيراد المواد الخام التي تفضلها بسهولة ودع أداتنا تحسب الحجم التفاضلي بدقة، مما يضمن شفافية تفصيلية للتكلفة.',
                },
            },
            features: {
                features: "سمات",
                Comprehensive: "شامل",
                machinesetup: "إعداد الآلة",
                Reports: "التقارير",
                content: "احصل على رؤى تفصيلية حول الأدوات وأوقات الدورة وعمليات التشغيل، مما يضمن أقصى قدر من الكفاءة في كل مرحلة من مراحل الإنتاج.",
                content1: "تقليل أخطاء التقدير باستخدام",
                content2: "رؤى مدفوعة بالذكاء الاصطناعي",
                fortoolpath: "لمسارات الأدوات",
                content3: "تجنب الأخطاء المكلفة وحقق أقصى أرباح بفضل خبرتنا المبنية على الذكاء الاصطناعي. يحدد نظامنا القيود التقنية وتحديات التصنيع التي قد تؤثر على كفاءة إنتاجك أو ربحيتك.",
                content4: "سهل الاستخدام",
                content5: "واجهة",
                content6: "استمتع بمنصة بديهية مصممة لسهولة الاستخدام، وتدعم تنسيقات الملفات الشائعة مثل STEP وSTL والمزيد - ولا يتطلب الأمر منحنى تعليميًا حادًا.",
                content7: "عملية مبسطة",
                content8: "تحسين",
                content9: "من التقدير إلى التنفيذ، تساعدك سير العمل الآلية لدينا على تقليل النفقات العامة، وتعزيز الإنتاجية، والحفاظ على مراقبة الجودة الاستثنائية"


            },
            testimonials: {
                heading: "الشهادات",
                subheading: "ماذا يقول العملاء",
                list: [
                    {
                        name: "جون د.",
                        subtitle: "لوريم إيبسوم ببساطة",
                        description: "لوريم إيبسوم هو نص وهمي يستخدم في صناعة الطباعة والتنضيد...",
                    },
                    {
                        name: "جين أ.",
                        subtitle: "الطباعة والتنضيد",
                        description: "لقد نجا ليس فقط خمسة قرون، ولكن أيضًا القفزة إلى التنضيد الإلكتروني...",
                    },
                    {
                        name: "مارك ر.",
                        subtitle: "صناعة التنضيد",
                        description: "أصبح شائعًا في الستينيات مع إصدار أوراق ليتراسيت التي تحتوي على لوريم إيبسوم...",
                    },
                    {
                        name: "آنا ب.",
                        subtitle: "نص لوريم إيبسوم",
                        description: "ومؤخرًا باستخدام برامج النشر المكتبي مثل ألدوس بيج ميكر التي تتضمن إصدارات...",
                    }
                ]
            },
            faq: {
                "title": "الأسئلة الشائعة",
                "subtitle": "الأسئلة المتكررة",
                "list": [
                    {
                        "question": "لوريم إيبسوم هو ببساطة نص شكلي يستخدم في الطباعة",
                        "answer": "لوريم إيبسوم هو نص وهمي يستخدم في صناعة الطباعة والتنضيد..."
                    },
                    {
                        "question": "لوريم إيبسوم هو نص شكلي في صناعة الطباعة والتنضيد.",
                        "answer": "لوريم إيبسوم كان النص الشكلي القياسي منذ القرن السادس عشر..."
                    },
                    {
                        "question": "لوريم إيبسوم هو نص شكلي في صناعة الطباعة والتنضيد.",
                        "answer": "لقد صمد ليس فقط لخمسة قرون، ولكن أيضًا قفز إلى التنضيد الإلكتروني..."
                    },
                    {
                        "question": "لوريم إيبسوم هو نص شكلي في صناعة الطباعة والتنضيد.",
                        "answer": "لقد صمد ليس فقط لخمسة قرون، ولكن أيضًا قفز إلى التنضيد الإلكتروني..."
                    }
                ]
            },
            cardbox: {
                "title": "هل أنت مستعد لتحسين إنتاج CNC الخاص بك؟ استخدم رمز QR ووجهه إلى صفحة التسجيل الخاصة بنا.",
                "description": "اختبر منصتنا الآن دون تسجيل. حمّل تصاميم الأجزاء الخاصة بك، واضبط المعلمات، وابدأ في توفير الوقت والمال اليوم. للحصول على إرشادات شخصية أو مزيد من المعلومات، لا تتردد في التواصل معنا أو التسجيل للحصول على نسخة تجريبية مجانية.",
                "contact": "اتصل بنا",
                "register": "سجل الآن"
            },
            footer: {
                text: "لوريم إيبسوم هو ببساطة نص شكلي يستخدم في صناعة الطباعة والتنضيد.",
                usefullinks: "روابط مفيدة",
                aboutus: "معلومات عنا",
                contactus: "اتصل بنا",
                faq: "الأسئلة الشائعة",
                helpandsuppport: "المساعدة والدعم",
                privacy: "سياسة الخصوصية",
                terms: "شروط الخدمة",
                touch: "تواصل معنا",
                email: "البريد الإلكتروني",
                phone: "هاتف",
                rights: "© 2025 إستمات.إي"
            }
        },
    },
    ta: {
        translation: {
            nav: {
                home: 'முகப்பு',
                about: 'எங்களை பற்றி',
                faq: 'அடிக்கடி கேட்கப்படும் கேள்விகள்',
                contact: 'தொடர்பு கொள்ள',
                signup: 'பதிவுபெறு',
                login: 'உள்நுழை',
            },
            home: {
                home_heading_line1: 'உங்கள்',
                home_heading_highlight: 'CNC செலவுக் கணிப்பு',
                home_heading_line2: '— துல்லியமான',
                home_heading_line3: 'அளவீடுகளை விநாடிகளில் பெறுங்கள்',
                get_started: 'தொடங்குங்கள்',
            },
            about: {
                about_welcome: '— வரவேற்கிறோம்',
                about_heading: 'எங்களை பற்றி',
                about_content: 'Estimate.ae இற்கு வரவேற்கிறோம். இது உடனடி மற்றும் நம்பகமான CNC செலவுக் கணிப்புகளுக்கான உன்னதமான தளமாகும். உங்கள் 3D வடிவமைப்புகளை பதிவேற்றவும், தானாகவே வடிவங்களை கண்டறிந்து, உற்பத்தி செயல்முறைகளை தேர்வு செய்யும் தொழில்நுட்பத்துடன் செலவுகளை கணிக்குங்கள்.'
            },
            benefits: {
                benefits: "முக்கிய நன்மைகள்",
                benefit1: {
                    title: 'உடனடி CNC கணிப்புகள்',
                    description: 'உருளை, ஆட்டை மற்றும் மெட்டல் பாகங்களுக்கு நேரடி விலைகள்.',
                },
                benefit2: {
                    title: 'தானியங்கி வடிவம் கண்டறிதல்',
                    description: 'பாக பகுப்பாய்வு மற்றும் இயந்திர தேர்வுகள் தானாக நடக்கும்.',
                },
                benefit3: {
                    title: 'தனிப்பயனாக்கப்பட்ட அளவுருக்கள்',
                    description: 'அளவீடுகளை சரிசெய்ய உங்களுக்கு முழு கட்டுப்பாடு.',
                },
                benefit4: {
                    title: 'செலவு சேமிப்பிற்கான நிறக்குறிகள்',
                    description: 'சிக்கனமான பகுதிகளை வண்ண எச்சரிக்கைகள் மூலம் கண்டறியுங்கள்.',
                },
                benefit5: {
                    title: 'உங்கள் மூலப் பகுதிகளைப் பதிவேற்றவும்',
                    description: 'உங்கள் சொந்த மூலப்பாகங்களை பதிவு செய்து துல்லியமான கணிப்புகள் பெறுங்கள்.',
                },
            },
            features: {
                features: "அம்சங்கள்",
                Comprehensive: "முழுமையானது",
                machinesetup: "இயந்திர அமைப்பு",
                Reports: "அறிக்கைகள்",
                content: "பொறிமுறைகள் மற்றும் இயந்திர நேரம் பற்றி முழுமையான தகவல்களுடன்.",
                content1: "CNC",
                content2: "குறியீடு உருவாக்கம்",
                fortoolpath: "கருவிப் பாதைக்கு",
                content3: "AI அடிப்படையிலான தவிர்ப்பு மற்றும் லாப உயர்வுகள்.",
                content4: "பயனர் நட்பு",
                content5: "இடைமுகம்",
                content6: "STEP, STL போன்ற கோப்புகள் ஆதரிக்கப்படும்.",
                content7: "வழிமுறை",
                content8: "மாற்றம்",
                content9: "தானியங்கி செயல்முறைகள் மூலம் உற்பத்தி அதிகரிக்கிறது.",
            },
            testimonials: {
                heading: "பாராட்டுகள்",
                subheading: "வாடிக்கையாளர்கள் கூறுகிறார்கள்",
                list: [
                    { name: "ஜான் D.", subtitle: "சாதாரண உரை", description: "அச்சுப் பணி மற்றும் வடிவமைப்பிற்கான எடுத்துக்காட்டு உரை..." },
                    { name: "ஜேன் A.", subtitle: "அச்சுத்தொழில்", description: "ஐந்தாம் நூற்றாண்டு வரை இருந்துவந்தது..." },
                    { name: "மார்க் R.", subtitle: "வடிவமைப்பு துறை", description: "1960களில் பிரபலமடைந்தது..." },
                    { name: "அன்னா B.", subtitle: "லோரெம் இப்சம் உரை", description: "அல்டஸ் பேஜ்மேக்கர் போன்ற மென்பொருள்களுடன் பரவியது..." }
                ]
            },
            faq: {
                title: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
                subtitle: "உங்கள் கேள்விக்கான பதில்கள்",
                list: [
                    { question: "Estimate.ae என்பது என்ன?", answer: "இது CNC செலவுக் கணிப்புக்கான தளம்." },
                    { question: "எப்படி தொடங்குவது?", answer: "பதிவு செய்து உங்கள் வடிவமைப்பை பதிவேற்றுங்கள்." },
                    { question: "எந்த கோப்பு வகைகள் ஆதரிக்கப்படுகின்றன?", answer: "STEP, STL மற்றும் பல." },
                    { question: "அளவுருக்களை மாற்ற முடியுமா?", answer: "ஆம், நீங்கள் மாற்றலாம்." }
                ]
            },
            cardbox: {
                title: "உங்கள் CNC உற்பத்தியை மேம்படுத்த தயாரா? QR குறியீட்டை ஸ்கேன் செய்யவும்.",
                description: "உங்கள் வடிவங்களைப் பதிவேற்றி, உங்கள் அளவுருக்களை மாற்றி, நேரத்தையும் பணத்தையும் சேமிக்கவும்.",
                contact: "தொடர்பு கொள்ள",
                register: "இப்போது பதிவு செய்யவும்"
            },
            footer: {
                text: "அச்சுத்தொழிலில் பயன்படும் எடுத்துக்காட்டு உரை.",
                usefullinks: "பயனுள்ள இணைப்புகள்",
                aboutus: "எங்களை பற்றி",
                contactus: "தொடர்பு கொள்ள",
                faq: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
                helpandsuppport: "உதவி மற்றும் ஆதரவு",
                privacy: "தனியுரிமைக் கொள்கை",
                terms: "விதிமுறைகள்",
                touch: "எங்களை தொடர்புகொள்ள",
                email: "மின்னஞ்சல்",
                phone: "தொலைபேசி",
                rights: "© 2025 Estimate.ae"
            }
        }
    }

};


i18n.use(initReactI18next).init({
    resources,
    fallbackLng: 'en',
    lng: 'en',
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;

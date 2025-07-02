import React, { createContext, useContext, useState } from 'react';

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (languageCode: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    'guest_review_manager': 'Guest Review Manager',
    'home': 'Home',
    'reviews': 'Reviews',
    'settings': 'Settings',
    'contact': 'Contact',
    'sign_out': 'Sign Out',
    'error_signing_out': 'Error signing out',
    'signed_out_successfully': 'Signed out successfully',
    'logged_out_message': 'You have been logged out.',
    'contact_title': 'Contact us for inquiries, support and partnership opportunities',
    'hotel_group_name': 'Hotel / Group Name',
    'enter_hotel_name': 'Enter your Hotel or Group Name',
    'full_name': 'Full Name',
    'enter_full_name': 'Enter full name',
    'email': 'Email',
    'enter_work_email': 'Enter your work Email',
    'work_phone': 'Work Phone',
    'enter_work_phone': 'Enter your work phone number',
    'message': 'Message',
    'enter_message': 'Enter your message...',
    'contact_us': 'Contact Us',
    'representative_offices': 'Reach out to our representative offices worldwide',
    'message_sent': 'Message Sent',
    'message_sent_description': "Thank you for contacting us. We'll get back to you soon!"
  },
  el: {
    'guest_review_manager': 'Διαχείριση Κριτικών Επισκεπτών',
    'home': 'Αρχική',
    'reviews': 'Κριτικές',
    'settings': 'Ρυθμίσεις',
    'contact': 'Επικοινωνία',
    'sign_out': 'Αποσύνδεση',
    'error_signing_out': 'Σφάλμα κατά την αποσύνδεση',
    'signed_out_successfully': 'Επιτυχής αποσύνδεση',
    'logged_out_message': 'Έχετε αποσυνδεθεί.',
    'contact_title': 'Επικοινωνήστε μαζί μας για ερωτήσεις, υποστήριξη και ευκαιρίες συνεργασίας',
    'hotel_group_name': 'Όνομα Ξενοδοχείου / Ομίλου',
    'enter_hotel_name': 'Εισάγετε το όνομα του Ξενοδοχείου ή Ομίλου σας',
    'full_name': 'Πλήρες Όνομα',
    'enter_full_name': 'Εισάγετε το πλήρες όνομα',
    'email': 'Email',
    'enter_work_email': 'Εισάγετε το επαγγελματικό σας Email',
    'work_phone': 'Τηλέφωνο Εργασίας',
    'enter_work_phone': 'Εισάγετε το τηλέφωνο εργασίας σας',
    'message': 'Μήνυμα',
    'enter_message': 'Εισάγετε το μήνυμά σας...',
    'contact_us': 'Επικοινωνήστε Μαζί Μας',
    'representative_offices': 'Επικοινωνήστε με τα αντιπροσωπευτικά μας γραφεία παγκοσμίως',
    'message_sent': 'Το Μήνυμα Στάλθηκε',
    'message_sent_description': 'Σας ευχαριστούμε που επικοινωνήσατε μαζί μας. Θα επικοινωνήσουμε σύντομα!'
  },
  fr: {
    'guest_review_manager': 'Gestionnaire d\'Avis Client',
    'home': 'Accueil',
    'reviews': 'Avis',
    'settings': 'Paramètres',
    'contact': 'Contact',
    'sign_out': 'Se Déconnecter',
    'error_signing_out': 'Erreur lors de la déconnexion',
    'signed_out_successfully': 'Déconnexion réussie',
    'logged_out_message': 'Vous avez été déconnecté.',
    'contact_title': 'Contactez-nous pour des demandes, support et opportunités de partenariat',
    'hotel_group_name': 'Nom de l\'Hôtel / Groupe',
    'enter_hotel_name': 'Entrez le nom de votre Hôtel ou Groupe',
    'full_name': 'Nom Complet',
    'enter_full_name': 'Entrez le nom complet',
    'email': 'Email',
    'enter_work_email': 'Entrez votre Email professionnel',
    'work_phone': 'Téléphone Professionnel',
    'enter_work_phone': 'Entrez votre numéro de téléphone professionnel',
    'message': 'Message',
    'enter_message': 'Entrez votre message...',
    'contact_us': 'Nous Contacter',
    'representative_offices': 'Contactez nos bureaux représentatifs dans le monde entier',
    'message_sent': 'Message Envoyé',
    'message_sent_description': 'Merci de nous avoir contactés. Nous vous répondrons bientôt!'
  },
  de: {
    'guest_review_manager': 'Gästebewertungs-Manager',
    'home': 'Startseite',
    'reviews': 'Bewertungen',
    'settings': 'Einstellungen',
    'contact': 'Kontakt',
    'sign_out': 'Abmelden',
    'error_signing_out': 'Fehler beim Abmelden',
    'signed_out_successfully': 'Erfolgreich abgemeldet',
    'logged_out_message': 'Sie wurden abgemeldet.',
    'contact_title': 'Kontaktieren Sie uns für Anfragen, Support und Partnerschaftsmöglichkeiten',
    'hotel_group_name': 'Hotel / Gruppen Name',
    'enter_hotel_name': 'Geben Sie Ihren Hotel- oder Gruppennamen ein',
    'full_name': 'Vollständiger Name',
    'enter_full_name': 'Vollständigen Namen eingeben',
    'email': 'Email',
    'enter_work_email': 'Geben Sie Ihre Geschäfts-Email ein',
    'work_phone': 'Arbeitstelefon',
    'enter_work_phone': 'Geben Sie Ihre Arbeitstelefonnummer ein',
    'message': 'Nachricht',
    'enter_message': 'Geben Sie Ihre Nachricht ein...',
    'contact_us': 'Kontaktieren Sie Uns',
    'representative_offices': 'Wenden Sie sich an unsere Vertretungsbüros weltweit',
    'message_sent': 'Nachricht Gesendet',
    'message_sent_description': 'Vielen Dank, dass Sie uns kontaktiert haben. Wir werden uns bald bei Ihnen melden!'
  },
  zh: {
    'guest_review_manager': '客户评价管理器',
    'home': '首页',
    'reviews': '评价',
    'settings': '设置',
    'contact': '联系',
    'sign_out': '登出',
    'error_signing_out': '登出时出错',
    'signed_out_successfully': '成功登出',
    'logged_out_message': '您已登出。',
    'contact_title': '联系我们获取咨询、支持和合作机会',
    'hotel_group_name': '酒店/集团名称',
    'enter_hotel_name': '输入您的酒店或集团名称',
    'full_name': '全名',
    'enter_full_name': '输入全名',
    'email': '邮箱',
    'enter_work_email': '输入您的工作邮箱',
    'work_phone': '工作电话',
    'enter_work_phone': '输入您的工作电话号码',
    'message': '消息',
    'enter_message': '输入您的消息...',
    'contact_us': '联系我们',
    'representative_offices': '联系我们在全球的代表处',
    'message_sent': '消息已发送',
    'message_sent_description': '感谢您联系我们。我们将很快回复您！'
  },
  ar: {
    'guest_review_manager': 'مدير تقييمات الضيوف',
    'home': 'الرئيسية',
    'reviews': 'التقييمات',
    'settings': 'الإعدادات',
    'contact': 'اتصل بنا',
    'sign_out': 'تسجيل الخروج',
    'error_signing_out': 'خطأ في تسجيل الخروج',
    'signed_out_successfully': 'تم تسجيل الخروج بنجاح',
    'logged_out_message': 'تم تسجيل خروجك.',
    'contact_title': 'اتصل بنا للاستفسارات والدعم وفرص الشراكة',
    'hotel_group_name': 'اسم الفندق / المجموعة',
    'enter_hotel_name': 'أدخل اسم الفندق أو المجموعة',
    'full_name': 'الاسم الكامل',
    'enter_full_name': 'أدخل الاسم الكامل',
    'email': 'البريد الإلكتروني',
    'enter_work_email': 'أدخل بريدك الإلكتروني للعمل',
    'work_phone': 'هاتف العمل',
    'enter_work_phone': 'أدخل رقم هاتف العمل',
    'message': 'الرسالة',
    'enter_message': 'أدخل رسالتك...',
    'contact_us': 'اتصل بنا',
    'representative_offices': 'تواصل مع مكاتبنا التمثيلية حول العالم',
    'message_sent': 'تم إرسال الرسالة',
    'message_sent_description': 'شكراً لتواصلك معنا. سنرد عليك قريباً!'
  },
  ja: {
    'guest_review_manager': 'ゲストレビューマネージャー',
    'home': 'ホーム',
    'reviews': 'レビュー',
    'settings': '設定',
    'contact': 'お問い合わせ',
    'sign_out': 'ログアウト',
    'error_signing_out': 'ログアウト時にエラーが発生しました',
    'signed_out_successfully': 'ログアウトしました',
    'logged_out_message': 'ログアウトしました。',
    'contact_title': 'お問い合わせ、サポート、パートナーシップの機会についてご連絡ください',
    'hotel_group_name': 'ホテル/グループ名',
    'enter_hotel_name': 'ホテルまたはグループ名を入力してください',
    'full_name': 'フルネーム',
    'enter_full_name': 'フルネームを入力してください',
    'email': 'メール',
    'enter_work_email': '仕事用メールアドレスを入力してください',
    'work_phone': '勤務先電話',
    'enter_work_phone': '勤務先の電話番号を入力してください',
    'message': 'メッセージ',
    'enter_message': 'メッセージを入力してください...',
    'contact_us': 'お問い合わせ',
    'representative_offices': '世界各地の代表事務所にお問い合わせください',
    'message_sent': 'メッセージが送信されました',
    'message_sent_description': 'お問い合わせありがとうございます。すぐに返信いたします！'
  }
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const setLanguage = (languageCode: string) => {
    setCurrentLanguage(languageCode);
  };

  const t = (key: string): string => {
    return translations[currentLanguage as keyof typeof translations]?.[key as keyof typeof translations.en] || key;
  };

  const value = {
    currentLanguage,
    setLanguage,
    t,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
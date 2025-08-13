import React, { createContext, useContext, useState, useEffect } from 'react';

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
    // Navigation & General
    'guest_review_manager': 'Guest Review Manager',
    'home': 'Home',
    'reviews': 'Reviews',
    'settings': 'Settings',
    'contact': 'Contact',
    'sign_out': 'Sign Out',
    'error_signing_out': 'Error signing out',
    'signed_out_successfully': 'Signed out successfully',
    'logged_out_message': 'You have been logged out.',

    // Contact Page
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
    'message_sent_description': "Thank you for contacting us. We'll get back to you soon!",

    // Dashboard
    'dashboard_title': 'Guest Review Dashboard',
    'dashboard_subtitle': 'Overview of your recent guest reviews and performance',
    'total_reviews': 'Total Reviews',
    'average_rating': 'Average Rating',
    'pending_replies': 'Pending Replies',
    'recent_reviews': 'Recent Reviews',
    'view_all_reviews': 'View All Reviews',
    'reply': 'Reply',
    'replied': 'Replied',
    'no_recent_reviews': 'No recent reviews to display',

    // Reviews Page
    'manage_reviews': 'Manage Your Reviews',
    'filter_platform': 'Filter by Platform',
    'all_platforms': 'All Platforms',
    'search_reviews': 'Search reviews...',
    'rating_filter': 'Rating Filter',
    'all_ratings': 'All Ratings',
    'stars': 'stars',
    'add_reply': 'Add Reply',
    'update_reply': 'Update Reply',
    'your_reply': 'Your reply...',
    'save_reply': 'Save Reply',
    'cancel': 'Cancel',
    'delete_review': 'Delete Review',
    'confirm_delete': 'Are you sure you want to delete this review?',
    'no_reviews_found': 'No reviews found matching your criteria',

    // Landing Page - Hero
    'hero_title': 'Manage Guest Reviews from All Platforms in One Place',
    'hero_subtitle': 'Streamline your reputation management with our powerful dashboard. Connect Google My Business, Booking.com, and Airbnb to monitor and respond to all guest reviews efficiently.',
    'get_started': 'Get Started Free',
    'learn_more': 'Learn More',

    // Landing Page - Features
    'features_title': 'Everything You Need to Manage Guest Reviews',
    'features_subtitle': 'Powerful tools designed specifically for hospitality professionals',
    'unified_dashboard_title': 'Unified Dashboard',
    'unified_dashboard_desc': 'See all your reviews from Google, Booking.com, and Airbnb in one clean interface',
    'smart_responses_title': 'Smart Responses',
    'smart_responses_desc': 'AI-powered suggestions help you craft professional replies quickly',
    'analytics_insights_title': 'Analytics & Insights',
    'analytics_insights_desc': 'Track your reputation trends and identify areas for improvement',
    'review_monitoring_title': 'Real-time Monitoring',
    'review_monitoring_desc': 'Get notified instantly when new reviews are posted across all platforms',
    'bulk_actions_title': 'Bulk Actions',
    'bulk_actions_desc': 'Manage multiple reviews efficiently with batch operations',
    'export_reports_title': 'Export Reports',
    'export_reports_desc': 'Generate detailed reports for stakeholders and management',

    // Landing Page - How It Works
    'how_it_works_title': 'How It Works',
    'step_connect_title': 'Connect',
    'step_connect_desc': 'Link your Google My Business account and upload CSV files from Booking.com and Airbnb',
    'step_import_title': 'Import',
    'step_import_desc': 'All your reviews are automatically organized in one clean, easy-to-use dashboard',
    'step_manage_title': 'Manage & Reply',
    'step_manage_desc': 'Respond to guest reviews efficiently and track your reputation across all platforms',

    // Landing Page - Testimonials
    'testimonials_title': 'Trusted by Hospitality Professionals',
    'testimonials_subtitle': 'See what our customers say about managing their guest reviews',

    // Landing Page - Signup
    'signup_title': 'Ready to Take Control of Your Reviews?',
    'signup_subtitle': 'Join thousands of hospitality professionals already using our platform',
    'email_placeholder': 'Enter your email address',
    'join_waitlist_button': 'Join Waitlist',
    'joining_text': 'Joining...',
    'email_required_title': 'Email Required',
    'email_required_desc': 'Please enter your email address',
    'success_waitlist_title': 'Welcome to the Waitlist!',
    'success_waitlist_desc': 'We\'ll notify you when we launch!',

    // Footer
    'footer_text': '© 2024 GuestReviews Pro. Built for hospitality professionals.',
    'footer_contact': 'Contact: hello@guestreviewspro.com'
  },
  
  el: {
    // Navigation & General
    'guest_review_manager': 'Διαχειριστής Αξιολογήσεων Επισκεπτών',
    'home': 'Αρχική',
    'reviews': 'Αξιολογήσεις',
    'settings': 'Ρυθμίσεις',
    'contact': 'Επικοινωνία',
    'sign_out': 'Αποσύνδεση',
    'error_signing_out': 'Σφάλμα κατά την αποσύνδεση',
    'signed_out_successfully': 'Επιτυχής αποσύνδεση',
    'logged_out_message': 'Έχετε αποσυνδεθεί.',

    // Contact Page
    'contact_title': 'Επικοινωνήστε μαζί μας για ερωτήσεις, υποστήριξη και ευκαιρίες συνεργασίας',
    'hotel_group_name': 'Όνομα Ξενοδοχείου / Ομίλου',
    'enter_hotel_name': 'Εισάγετε το όνομα του Ξενοδοχείου ή Ομίλου σας',
    'full_name': 'Πλήρες Όνομα',
    'enter_full_name': 'Εισάγετε το πλήρες όνομα',
    'email': 'Email',
    'enter_work_email': 'Εισάγετε το επαγγελματικό σας Email',
    'work_phone': 'Επαγγελματικό Τηλέφωνο',
    'enter_work_phone': 'Εισάγετε τον επαγγελματικό σας αριθμό τηλεφώνου',
    'message': 'Μήνυμα',
    'enter_message': 'Εισάγετε το μήνυμά σας...',
    'contact_us': 'Επικοινωνήστε Μαζί Μας',
    'representative_offices': 'Επικοινωνήστε με τα αντιπροσωπευτικά μας γραφεία παγκοσμίως',
    'message_sent': 'Το Μήνυμα Στάλθηκε',
    'message_sent_description': 'Ευχαριστούμε που επικοινωνήσατε μαζί μας. Θα σας απαντήσουμε σύντομα!',

    // Dashboard
    'dashboard_title': 'Πίνακας Ελέγχου Αξιολογήσεων Επισκεπτών',
    'dashboard_subtitle': 'Επισκόπηση των πρόσφατων αξιολογήσεων και της απόδοσής σας',
    'total_reviews': 'Συνολικές Αξιολογήσεις',
    'average_rating': 'Μέση Βαθμολογία',
    'pending_replies': 'Εκκρεμείς Απαντήσεις',
    'recent_reviews': 'Πρόσφατες Αξιολογήσεις',
    'view_all_reviews': 'Προβολή Όλων των Αξιολογήσεων',
    'reply': 'Απάντηση',
    'replied': 'Απαντήθηκε',
    'no_recent_reviews': 'Δεν υπάρχουν πρόσφατες αξιολογήσεις προς εμφάνιση',

    // Reviews Page
    'manage_reviews': 'Διαχείριση των Αξιολογήσεών σας',
    'filter_platform': 'Φιλτράρισμα ανά Πλατφόρμα',
    'all_platforms': 'Όλες οι Πλατφόρμες',
    'search_reviews': 'Αναζήτηση αξιολογήσεων...',
    'rating_filter': 'Φίλτρο Βαθμολογίας',
    'all_ratings': 'Όλες οι Βαθμολογίες',
    'stars': 'αστέρια',
    'add_reply': 'Προσθήκη Απάντησης',
    'update_reply': 'Ενημέρωση Απάντησης',
    'your_reply': 'Η απάντησή σας...',
    'save_reply': 'Αποθήκευση Απάντησης',
    'cancel': 'Ακύρωση',
    'delete_review': 'Διαγραφή Αξιολόγησης',
    'confirm_delete': 'Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την αξιολόγηση;',
    'no_reviews_found': 'Δε βρέθηκαν αξιολογήσεις που να ταιριάζουν με τα κριτήριά σας',

    // Landing Page - Hero
    'hero_title': 'Διαχειριστείτε τις Αξιολογήσεις Επισκεπτών από Όλες τις Πλατφόρμες σε Ένα Μέρος',
    'hero_subtitle': 'Απλοποιήστε τη διαχείριση της φήμης σας με τον ισχυρό μας πίνακα ελέγχου. Συνδέστε το Google My Business, Booking.com και Airbnb για να παρακολουθείτε και να απαντάτε σε όλες τις αξιολογήσεις επισκεπτών αποτελεσματικά.',
    'get_started': 'Ξεκινήστε Δωρεάν',
    'learn_more': 'Μάθετε Περισσότερα',

    // Landing Page - Features
    'features_title': 'Όλα όσα Χρειάζεστε για τη Διαχείριση Αξιολογήσεων Επισκεπτών',
    'features_subtitle': 'Ισχυρά εργαλεία σχεδιασμένα ειδικά για επαγγελματίες φιλοξενίας',
    'unified_dashboard_title': 'Ενοποιημένος Πίνακας Ελέγχου',
    'unified_dashboard_desc': 'Δείτε όλες τις αξιολογήσεις σας από Google, Booking.com και Airbnb σε μια καθαρή διεπαφή',
    'smart_responses_title': 'Έξυπνες Απαντήσεις',
    'smart_responses_desc': 'Προτάσεις με τεχνητή νοημοσύνη σας βοηθούν να δημιουργήσετε επαγγελματικές απαντήσεις γρήγορα',
    'analytics_insights_title': 'Αναλυτικά & Πληροφορίες',
    'analytics_insights_desc': 'Παρακολουθήστε τις τάσεις της φήμης σας και εντοπίστε περιοχές για βελτίωση',
    'review_monitoring_title': 'Παρακολούθηση σε Πραγματικό Χρόνο',
    'review_monitoring_desc': 'Λαμβάνετε ειδοποιήσεις άμεσα όταν δημοσιεύονται νέες αξιολογήσεις σε όλες τις πλατφόρμες',
    'bulk_actions_title': 'Μαζικές Ενέργειες',
    'bulk_actions_desc': 'Διαχειριστείτε πολλές αξιολογήσεις αποτελεσματικά με ομαδικές λειτουργίες',
    'export_reports_title': 'Εξαγωγή Αναφορών',
    'export_reports_desc': 'Δημιουργήστε λεπτομερείς αναφορές για ενδιαφερόμενους και διοίκηση',

    // Landing Page - How It Works
    'how_it_works_title': 'Πώς Λειτουργεί',
    'step_connect_title': 'Σύνδεση',
    'step_connect_desc': 'Συνδέστε τον λογαριασμό σας Google My Business και ανεβάστε αρχεία CSV από Booking.com και Airbnb',
    'step_import_title': 'Εισαγωγή',
    'step_import_desc': 'Όλες οι αξιολογήσεις σας οργανώνονται αυτόματα σε έναν καθαρό, εύκολο στη χρήση πίνακα ελέγχου',
    'step_manage_title': 'Διαχείριση & Απάντηση',
    'step_manage_desc': 'Απαντήστε στις αξιολογήσεις επισκεπτών αποτελεσματικά και παρακολουθήστε τη φήμη σας σε όλες τις πλατφόρμες',

    // Landing Page - Testimonials
    'testimonials_title': 'Εμπιστεύονται οι Επαγγελματίες Φιλοξενίας',
    'testimonials_subtitle': 'Δείτε τι λένε οι πελάτες μας για τη διαχείριση των αξιολογήσεων επισκεπτών τους',

    // Landing Page - Signup
    'signup_title': 'Έτοιμοι να Πάρετε τον Έλεγχο των Αξιολογήσεών σας;',
    'signup_subtitle': 'Εγγραφείτε μαζί με χιλιάδες επαγγελματίες φιλοξενίας που ήδη χρησιμοποιούν την πλατφόρμα μας',
    'email_placeholder': 'Εισάγετε τη διεύθυνση email σας',
    'join_waitlist_button': 'Εγγραφή στη Λίστα Αναμονής',
    'joining_text': 'Εγγραφή...',
    'email_required_title': 'Απαιτείται Email',
    'email_required_desc': 'Παρακαλώ εισάγετε τη διεύθυνση email σας',
    'success_waitlist_title': 'Καλώς ήρθατε στη Λίστα Αναμονής!',
    'success_waitlist_desc': 'Θα σας ενημερώσουμε όταν λανσάρουμε!',

    // Footer
    'footer_text': '© 2024 GuestReviews Pro. Δημιουργήθηκε για επαγγελματίες φιλοξενίας στην Ελλάδα.',
    'footer_contact': 'Επικοινωνία: hello@guestreviewspro.com'
  }
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('preferred-language') || 'en';
  });

  const setLanguage = (languageCode: string) => {
    setCurrentLanguage(languageCode);
    localStorage.setItem('preferred-language', languageCode);
  };

  const t = (key: string): string => {
    return translations[currentLanguage as keyof typeof translations]?.[key as keyof typeof translations.en] || key;
  };

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
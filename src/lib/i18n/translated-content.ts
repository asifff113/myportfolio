import { PortfolioContent } from "../content-types";
import { mockPortfolioContent } from "../mock-data";

// Helper to deep clone and modify
const clone = (data: any) => JSON.parse(JSON.stringify(data));

// ============================================================================
// SPANISH (ES)
// ============================================================================
const esContent = clone(mockPortfolioContent) as any;

esContent.personalInfo.headline = "Desarrollador Full Stack y Solucionador Creativo";
esContent.personalInfo.shortBio = "Soy un desarrollador apasionado que ama construir aplicaciones web hermosas y funcionales. Con experiencia en tecnologías web modernas, creo soluciones que marcan la diferencia.";
esContent.personalInfo.currentStatus = "Abierto a oportunidades";

esContent.skillCategories[0].name = "Desarrollo Frontend";
esContent.skillCategories[0].description = "Construyendo interfaces de usuario hermosas y responsivas";
esContent.skillCategories[1].name = "Desarrollo Backend";
esContent.skillCategories[1].description = "Creando aplicaciones del lado del servidor robustas y escalables";
esContent.skillCategories[2].name = "Herramientas y Tecnologías";
esContent.skillCategories[2].description = "Herramientas de desarrollo y plataformas con las que trabajo";

esContent.experience[0].role = "Ingeniero de Software Senior";
esContent.experience[0].description = "Liderando el desarrollo de aplicaciones web escalables utilizando React y Node.js. Mentoreando desarrolladores junior e implementando mejores prácticas.";
esContent.experience[1].role = "Desarrollador Full Stack";
esContent.experience[1].description = "Desarrollé y mantuve múltiples aplicaciones web orientadas al cliente. Colaboré con diseñadores y gerentes de producto para entregar características de alta calidad.";

esContent.education[0].degree = "Licenciatura en Ciencias de la Computación";
esContent.education[0].description = "Graduado con honores. Enfoque en ingeniería de software y sistemas distribuidos.";

esContent.projects[0].title = "Plataforma de E-commerce";
esContent.projects[0].description = "Una solución de comercio electrónico completa con gestión de inventario en tiempo real, procesamiento de pagos y panel de administración.";
esContent.projects[1].title = "Aplicación de Gestión de Tareas";
esContent.projects[1].description = "Una herramienta de productividad colaborativa con actualizaciones en tiempo real, intercambio de archivos y gestión de equipos.";

// ============================================================================
// FRENCH (FR)
// ============================================================================
const frContent = clone(mockPortfolioContent) as any;

frContent.personalInfo.headline = "Développeur Full Stack & Résolveur de Problèmes";
frContent.personalInfo.shortBio = "Je suis un développeur passionné qui aime créer des applications web belles et fonctionnelles. Avec une expertise dans les technologies web modernes, je crée des solutions qui font la différence.";
frContent.personalInfo.currentStatus = "Ouvert aux opportunités";

frContent.skillCategories[0].name = "Développement Frontend";
frContent.skillCategories[0].description = "Création d'interfaces utilisateur belles et réactives";
frContent.skillCategories[1].name = "Développement Backend";
frContent.skillCategories[1].description = "Création d'applications côté serveur robustes et évolutives";
frContent.skillCategories[2].name = "Outils & Technologies";
frContent.skillCategories[2].description = "Outils de développement et plateformes avec lesquels je travaille";

frContent.experience[0].role = "Ingénieur Logiciel Senior";
frContent.experience[0].description = "Direction du développement d'applications web évolutives utilisant React et Node.js. Mentorat de développeurs juniors et mise en œuvre des meilleures pratiques.";
frContent.experience[1].role = "Développeur Full Stack";
frContent.experience[1].description = "Développement et maintenance de plusieurs applications web orientées client. Collaboration avec les designers et les chefs de produit pour livrer des fonctionnalités de haute qualité.";

frContent.education[0].degree = "Licence en Informatique";
frContent.education[0].description = "Diplômé avec mention. Concentration sur le génie logiciel et les systèmes distribués.";

frContent.projects[0].title = "Plateforme E-commerce";
frContent.projects[0].description = "Une solution de commerce électronique complète avec gestion des stocks en temps réel, traitement des paiements et tableau de bord d'administration.";
frContent.projects[1].title = "Application de Gestion de Tâches";
frContent.projects[1].description = "Un outil de productivité collaboratif avec mises à jour en temps réel, partage de fichiers et gestion d'équipe.";

// ============================================================================
// BANGLA (BN)
// ============================================================================
const bnContent = clone(mockPortfolioContent) as any;

bnContent.personalInfo.headline = "ফুল স্ট্যাক ডেভেলপার এবং ক্রিয়েটিভ প্রবলেম সলভার";
bnContent.personalInfo.shortBio = "আমি একজন উৎসাহী ডেভেলপার যিনি সুন্দর, কার্যকরী ওয়েব অ্যাপ্লিকেশন তৈরি করতে ভালোবাসেন। আধুনিক ওয়েব প্রযুক্তিতে দক্ষতার সাথে, আমি এমন সমাধান তৈরি করি যা পার্থক্য তৈরি করে।";
bnContent.personalInfo.currentStatus = "কাজের সুযোগ খুঁজছি";

bnContent.skillCategories[0].name = "ফ্রন্টএন্ড ডেভেলপমেন্ট";
bnContent.skillCategories[0].description = "সুন্দর এবং রেসপন্সিভ ইউজার ইন্টারফেস তৈরি করা";
bnContent.skillCategories[1].name = "ব্যাকএন্ড ডেভেলপমেন্ট";
bnContent.skillCategories[1].description = "শক্তিশালী এবং স্কেলেবল সার্ভার-সাইড অ্যাপ্লিকেশন তৈরি করা";
bnContent.skillCategories[2].name = "টুলস এবং টেকনোলজি";
bnContent.skillCategories[2].description = "ডেভেলপমেন্ট টুলস এবং প্ল্যাটফর্ম যা আমি ব্যবহার করি";

bnContent.experience[0].role = "সিনিয়র সফটওয়্যার ইঞ্জিনিয়ার";
bnContent.experience[0].description = "React এবং Node.js ব্যবহার করে স্কেলেবল ওয়েব অ্যাপ্লিকেশন ডেভেলপমেন্টে নেতৃত্ব দেওয়া। জুনিয়র ডেভেলপারদের মেন্টরিং এবং সেরা অনুশীলন বাস্তবায়ন করা।";
bnContent.experience[1].role = "ফুল স্ট্যাক ডেভেলপার";
bnContent.experience[1].description = "একাধিক ক্লায়েন্ট-ফেসিং ওয়েব অ্যাপ্লিকেশন তৈরি এবং রক্ষণাবেক্ষণ করা। উচ্চ-মানের ফিচার সরবরাহের জন্য ডিজাইনার এবং প্রোডাক্ট ম্যানেজারদের সাথে সহযোগিতা করা।";

bnContent.education[0].degree = "কম্পিউটার সায়েন্সে স্নাতক";
bnContent.education[0].description = "সম্মানসহ স্নাতক। সফটওয়্যার ইঞ্জিনিয়ারিং এবং ডিস্ট্রিবিউটেড সিস্টেমের উপর ফোকাস।";

bnContent.projects[0].title = "ই-কমার্স প্ল্যাটফর্ম";
bnContent.projects[0].description = "রিয়েল-টাইম ইনভেন্টরি ম্যানেজমেন্ট, পেমেন্ট প্রসেসিং এবং অ্যাডমিন ড্যাশবোর্ড সহ একটি সম্পূর্ণ ই-কমার্স সমাধান।";
bnContent.projects[1].title = "টাস্ক ম্যানেজমেন্ট অ্যাপ";
bnContent.projects[1].description = "রিয়েল-টাইম আপডেট, ফাইল শেয়ারিং এবং টিম ম্যানেজমেন্ট সহ একটি কোলাবোরেটিভ প্রোডাক্টিভিটি টুল।";

// ============================================================================
// GERMAN (DE)
// ============================================================================
const deContent = clone(mockPortfolioContent) as any;

deContent.personalInfo.headline = "Full Stack Entwickler & Kreativer Problemlöser";
deContent.personalInfo.shortBio = "Ich bin ein leidenschaftlicher Entwickler, der es liebt, schöne, funktionale Webanwendungen zu erstellen. Mit Expertise in modernen Webtechnologien erstelle ich Lösungen, die einen Unterschied machen.";
deContent.personalInfo.currentStatus = "Offen für Möglichkeiten";

deContent.skillCategories[0].name = "Frontend Entwicklung";
deContent.skillCategories[0].description = "Erstellung schöner und reaktionsfähiger Benutzeroberflächen";
deContent.skillCategories[1].name = "Backend Entwicklung";
deContent.skillCategories[1].description = "Erstellung robuster und skalierbarer serverseitiger Anwendungen";
deContent.skillCategories[2].name = "Tools & Technologien";
deContent.skillCategories[2].description = "Entwicklungstools und Plattformen, mit denen ich arbeite";

deContent.experience[0].role = "Senior Software Engineer";
deContent.experience[0].description = "Leitung der Entwicklung skalierbarer Webanwendungen mit React und Node.js. Mentoring von Junior-Entwicklern und Implementierung von Best Practices.";
deContent.experience[1].role = "Full Stack Entwickler";
deContent.experience[1].description = "Entwicklung und Wartung mehrerer kundenorientierter Webanwendungen. Zusammenarbeit mit Designern und Produktmanagern zur Bereitstellung hochwertiger Funktionen.";

deContent.education[0].degree = "Bachelor in Informatik";
deContent.education[0].description = "Abschluss mit Auszeichnung. Schwerpunkt auf Softwaretechnik und verteilten Systemen.";

deContent.projects[0].title = "E-Commerce Plattform";
deContent.projects[0].description = "Eine vollständige E-Commerce-Lösung mit Echtzeit-Bestandsverwaltung, Zahlungsabwicklung und Admin-Dashboard.";
deContent.projects[1].title = "Aufgabenverwaltungs-App";
deContent.projects[1].description = "Ein kollaboratives Produktivitätstool mit Echtzeit-Updates, Dateifreigabe und Teamverwaltung.";


export const translatedContent = {
  en: mockPortfolioContent,
  es: esContent,
  fr: frContent,
  bn: bnContent,
  de: deContent,
};

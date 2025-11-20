import { useLanguage } from "./LanguageContext";
import { translatedContent } from "./translated-content";
import { PortfolioContent, PersonalInfo, SkillCategory, ExperienceItem, EducationItem, Project } from "../content-types";

export function useTranslatedContent(initialContent: PortfolioContent) {
  // We now rely on Google Translate for all translations.
  // We always return the initial (English/Real) content to ensure
  // the DOM is populated with the correct data before Google Translate runs.
  return initialContent;
}

export function useTranslatedPersonalInfo(initial: PersonalInfo) {
  // Always return initial content to prevent data loss
  return initial;
}

export function useTranslatedSkills(initialCategories: SkillCategory[]) {
  // Always return initial content to prevent data loss
  return initialCategories;
}

export function useTranslatedExperience(initial: ExperienceItem[]) {
  // Always return initial content to prevent data loss
  return initial;
}

export function useTranslatedEducation(initial: EducationItem[]) {
  // Always return initial content to prevent data loss
  return initial;
}

export function useTranslatedProjects(initial: Project[]) {
  // Always return initial content to prevent data loss
  return initial;
}


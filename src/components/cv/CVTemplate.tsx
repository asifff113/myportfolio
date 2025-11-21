/**
 * CV Template Component
 * Generates a professional PDF resume using @react-pdf/renderer
 */

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import { PortfolioContent } from '@/lib/content-types';

// Create styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },
  headline: {
    fontSize: 14,
    color: '#3B82F6',
    marginBottom: 8,
  },
  contactInfo: {
    flexDirection: 'row',
    fontSize: 10,
    color: '#6B7280',
    marginTop: 5,
    flexWrap: 'wrap',
  },
  contactItem: {
    marginRight: 15,
    marginBottom: 3,
  },
  section: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sectionContent: {
    marginLeft: 0,
  },
  bio: {
    fontSize: 10,
    lineHeight: 1.6,
    color: '#374151',
    textAlign: 'justify',
  },
  itemContainer: {
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 10,
    color: '#3B82F6',
    marginBottom: 2,
  },
  itemDate: {
    fontSize: 9,
    color: '#6B7280',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 10,
    color: '#4B5563',
    lineHeight: 1.5,
    marginTop: 3,
  },
  skillCategory: {
    marginBottom: 10,
  },
  skillCategoryName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },
  skillsList: {
    fontSize: 10,
    color: '#4B5563',
    marginLeft: 10,
  },
  bulletPoint: {
    marginBottom: 3,
  },
  link: {
    color: '#3B82F6',
    textDecoration: 'none',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#9CA3AF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  badge: {
    backgroundColor: '#EFF6FF',
    color: '#3B82F6',
    padding: '3 8',
    borderRadius: 4,
    fontSize: 9,
    marginRight: 5,
    marginBottom: 3,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
});

interface CVTemplateProps {
  content: PortfolioContent;
}

export const CVTemplate: React.FC<CVTemplateProps> = ({ content }) => {
  const { personalInfo, skillCategories, education, experience, projects, achievements, certificates } = content;

  if (!personalInfo) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>Personal information not available</Text>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.name}</Text>
          <Text style={styles.headline}>{personalInfo.headline}</Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactItem}>{personalInfo.email}</Text>
            {personalInfo.phone && <Text style={styles.contactItem}>{personalInfo.phone}</Text>}
            <Text style={styles.contactItem}>{personalInfo.location}</Text>
            {personalInfo.currentStatus && <Text style={styles.contactItem}>• {personalInfo.currentStatus}</Text>}
          </View>
        </View>

        {/* About / Bio Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.bio}>{personalInfo.longBio}</Text>
        </View>

        {/* Skills Section */}
        {skillCategories && skillCategories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technical Skills</Text>
            {skillCategories.slice(0, 5).map((category, idx) => (
              <View key={idx} style={styles.skillCategory}>
                <Text style={styles.skillCategoryName}>• {category.name}</Text>
                <Text style={styles.skillsList}>
                  {category.skills.map(s => s.name).join(' • ')}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Experience Section */}
        {experience && experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {experience.slice(0, 4).map((exp, idx) => (
              <View key={idx} style={styles.itemContainer}>
                <View style={styles.row}>
                  <Text style={styles.itemTitle}>{exp.role}</Text>
                </View>
                <Text style={styles.itemSubtitle}>{exp.company}</Text>
                <Text style={styles.itemDate}>
                  {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - 
                  {exp.isCurrent ? ' Present' : new Date(exp.endDate!).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </Text>
                <Text style={styles.itemDescription}>{exp.description}</Text>
                {exp.technologies && exp.technologies.length > 0 && (
                  <View style={styles.badgeContainer}>
                    {exp.technologies.slice(0, 6).map((tech: string, i: number) => (
                      <Text key={i} style={styles.badge}>{tech}</Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education Section */}
        {education && education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.slice(0, 3).map((edu, idx) => (
              <View key={idx} style={styles.itemContainer}>
                <Text style={styles.itemTitle}>{edu.degree}</Text>
                <Text style={styles.itemSubtitle}>{edu.institution}</Text>
                <Text style={styles.itemDate}>
                  {new Date(edu.startDate).getFullYear()} - {edu.isCurrent ? 'Present' : new Date(edu.endDate!).getFullYear()}
                </Text>
                {edu.description && <Text style={styles.itemDescription}>{edu.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Projects Section */}
        {projects && projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Projects</Text>
            {projects.slice(0, 3).map((project, idx) => (
              <View key={idx} style={styles.itemContainer}>
                <Text style={styles.itemTitle}>{project.title}</Text>
                <Text style={styles.itemDescription}>{project.summary}</Text>
                {project.techStack && project.techStack.length > 0 && (
                  <View style={styles.badgeContainer}>
                    {project.techStack.slice(0, 6).map((tech: string, i: number) => (
                      <Text key={i} style={styles.badge}>{tech}</Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Achievements Section */}
        {achievements && achievements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            {achievements.slice(0, 5).map((achievement, idx) => (
              <View key={idx} style={styles.bulletPoint}>
                <Text style={styles.itemDescription}>• {achievement.title} - {achievement.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Certificates Section */}
        {certificates && certificates.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {certificates.slice(0, 5).map((cert, idx) => (
              <View key={idx} style={styles.itemContainer}>
                <Text style={styles.itemTitle}>{cert.title}</Text>
                <Text style={styles.itemSubtitle}>{cert.issuer}</Text>
                <Text style={styles.itemDate}>
                  {new Date(cert.issuedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Generated from portfolio website • {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Disable auto-hyphenation to avoid broken words in PDF
Font.registerHyphenationCallback(word => [word]);

// Styles Generator based on chosen Template
const getStyles = (template = 'classic') => {
  const isSerif = template === 'classic';
  const isMinimal = template === 'minimalist';
  const fontFamily = isSerif ? 'Times-Roman' : 'Helvetica';
  const fontBold = isSerif ? 'Times-Bold' : 'Helvetica-Bold';
  const fontItalic = isSerif ? 'Times-Italic' : 'Helvetica-Oblique';

  return StyleSheet.create({
    page: {
      paddingTop: isMinimal ? 24 : 32,
      paddingBottom: isMinimal ? 24 : 32,
      paddingLeft: isMinimal ? 32 : 36,
      paddingRight: isMinimal ? 32 : 36,
      fontFamily: fontFamily,
      fontSize: isMinimal ? 9 : 9.5,
      lineHeight: 1.35,
      color: '#1e293b',
    },
    // Header Section
    header: {
      marginBottom: isMinimal ? 8 : 12,
      borderBottomWidth: template === 'modern' ? 2 : 1,
      borderBottomColor: template === 'modern' ? '#2563eb' : '#0f172a',
      paddingBottom: isMinimal ? 4 : 6,
      textAlign: isSerif ? 'center' : 'left',
    },
    name: {
      fontSize: isMinimal ? 16 : 18,
      fontFamily: fontBold,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 3,
      color: template === 'modern' ? '#1e3a8a' : '#000000',
    },
    contactRow: {
      fontSize: 8.5,
      color: '#475569',
      marginTop: 2,
    },
    // Section Header
    section: {
      marginTop: isMinimal ? 6 : 8,
      marginBottom: isMinimal ? 4 : 6,
    },
    sectionTitle: {
      fontSize: isMinimal ? 9.5 : 10.5,
      fontFamily: fontBold,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      color: template === 'modern' ? '#1e40af' : '#0f172a',
      borderBottomWidth: 0.8,
      borderBottomColor: template === 'modern' ? '#93c5fd' : '#475569',
      paddingBottom: 2,
      marginBottom: isMinimal ? 4 : 5,
    },
    summaryText: {
      fontSize: isMinimal ? 8.5 : 9,
      lineHeight: 1.4,
      color: '#334155',
    },
    // Work / Project Block
    entryBlock: {
      marginBottom: isMinimal ? 5 : 7,
    },
    entryHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 2,
    },
    jobTitle: {
      fontSize: isMinimal ? 9 : 9.5,
      fontFamily: fontBold,
      color: '#0f172a',
    },
    companyName: {
      fontSize: isMinimal ? 8.5 : 9,
      fontFamily: fontItalic,
      color: '#334155',
    },
    dateLocation: {
      fontSize: 8,
      color: '#475569',
      textAlign: 'right',
    },
    // Bullet Points without Text Overlapping
    bulletRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: isMinimal ? 1.5 : 2.5,
      paddingLeft: 4,
    },
    bulletDot: {
      width: 10,
      fontSize: 9,
      fontFamily: fontBold,
      color: '#0f172a',
      marginTop: 0,
    },
    bulletText: {
      flex: 1,
      fontSize: isMinimal ? 8.5 : 9,
      lineHeight: 1.35,
      color: '#334155',
    },
    // Skills Formatting
    skillRow: {
      fontSize: isMinimal ? 8.5 : 9,
      lineHeight: 1.35,
      marginBottom: 2,
    },
    skillCategory: {
      fontFamily: fontBold,
      color: '#0f172a',
    },
  });
};

export default function PDFDocument({ data, template = 'classic' }) {
  if (!data) return null;

  const styles = getStyles(template);

  const {
    personalInfo = {},
    summary = '',
    workExperience = [],
    education = [],
    skills = {},
    projects = [],
    certifications = [],
  } = data;

  const contactItems = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.linkedin,
    personalInfo.github,
    personalInfo.website,
  ].filter(Boolean);

  return (
    <Document title={`${personalInfo.fullName || 'Resume'} - ATS Optimized`}>
      <Page size="A4" style={styles.page}>
        
        {/* Header - Contact Info */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.fullName || 'YOUR NAME'}</Text>
          <Text style={styles.contactRow}>
            {contactItems.join('   |   ')}
          </Text>
        </View>

        {/* Professional Summary */}
        {summary ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        ) : null}

        {/* Technical Skills */}
        {skills && (skills.hardSkills?.length > 0 || skills.tools?.length > 0) ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technical & Professional Skills</Text>
            {skills.hardSkills?.length > 0 && (
              <Text style={styles.skillRow}>
                <Text style={styles.skillCategory}>Core Skills: </Text>
                {skills.hardSkills.join(', ')}
              </Text>
            )}
            {skills.tools?.length > 0 && (
              <Text style={styles.skillRow}>
                <Text style={styles.skillCategory}>Tools & Frameworks: </Text>
                {skills.tools.join(', ')}
              </Text>
            )}
            {skills.softSkills?.length > 0 && (
              <Text style={styles.skillRow}>
                <Text style={styles.skillCategory}>Professional Competencies: </Text>
                {skills.softSkills.join(', ')}
              </Text>
            )}
          </View>
        ) : null}

        {/* Work Experience */}
        {workExperience && workExperience.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {workExperience.map((job, idx) => (
              <View key={idx} style={styles.entryBlock}>
                <View style={styles.entryHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.jobTitle}>{job.jobTitle}</Text>
                    <Text style={styles.companyName}>
                      {job.company}{job.location ? ` — ${job.location}` : ''}
                    </Text>
                  </View>
                  <Text style={styles.dateLocation}>
                    {job.startDate} {job.endDate ? `- ${job.endDate}` : ''}
                  </Text>
                </View>

                {job.bulletPoints && job.bulletPoints.map((bp, bIdx) => (
                  <View key={bIdx} style={styles.bulletRow}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{bp}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ) : null}

        {/* Projects */}
        {projects && projects.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technical Projects</Text>
            {projects.map((proj, idx) => (
              <View key={idx} style={styles.entryBlock}>
                <View style={styles.entryHeaderRow}>
                  <Text style={styles.jobTitle}>
                    {proj.name} {proj.technologies ? `(${proj.technologies})` : ''}
                  </Text>
                  {proj.link ? <Text style={styles.dateLocation}>{proj.link}</Text> : null}
                </View>
                {proj.bulletPoints && proj.bulletPoints.map((bp, bIdx) => (
                  <View key={bIdx} style={styles.bulletRow}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{bp}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ) : null}

        {/* Education */}
        {education && education.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu, idx) => (
              <View key={idx} style={styles.entryBlock}>
                <View style={styles.entryHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.jobTitle}>{edu.degree}</Text>
                    <Text style={styles.companyName}>
                      {edu.institution}{edu.location ? `, ${edu.location}` : ''}
                    </Text>
                  </View>
                  <Text style={styles.dateLocation}>{edu.graduationYear}</Text>
                </View>
                {edu.details ? (
                  <View style={styles.bulletRow}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{edu.details}</Text>
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {/* Certifications */}
        {certifications && certifications.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {certifications.map((cert, idx) => (
              <View key={idx} style={styles.bulletRow}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{cert}</Text>
              </View>
            ))}
          </View>
        ) : null}

      </Page>
    </Document>
  );
}

import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: 'Helvetica'
  },
  title: {
    fontSize: 36,
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40
  },
  name: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 'bold'
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20
  },
  footer: {
    marginTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  small: {
    fontSize: 12
  }
})

const CertificatePDF = ({ certificate, isValid }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>CERTIFICATE</Text>
      <Text style={styles.subtitle}>of Course Completion</Text>

      <Text style={styles.text}>This is to certify that</Text>
      <Text style={styles.name}>{certificate.name}</Text>
      <Text style={styles.text}>has successfully completed</Text>
      <Text style={styles.subtitle}>{certificate.course}</Text>

      <View style={{ marginTop: 40 }}>
        <Text style={styles.text}>Issued By: {certificate.issuer}</Text>
        <Text style={styles.text}>
          Issued On:{' '}
          {new Date(certificate.dateOfIssue).toLocaleDateString()}
        </Text>
        <Text style={styles.text}>Certificate ID: {certificate.certId}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.small}>Authorized Signatory</Text>
        <Text style={styles.small}>
          Status: {isValid ? 'VALID' : 'INVALID'}
        </Text>
      </View>
    </Page>
  </Document>
)

export default CertificatePDF

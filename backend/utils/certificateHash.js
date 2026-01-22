const bcrypt = require("bcryptjs");

/**
 * Generate certificate hash (store this in DB)
 */
const generateCertificateHash = async (
  certId,
  name,
  course,
  issuer,
  dateOfIssue,
) => {
  const dataString = `${certId}|${name}|${course}|${issuer}|${dateOfIssue}`;
  return await bcrypt.hash(dataString, 10);
};

/**
 * Verify certificate integrity (tamper check)
 */
const verifyCertificate = async (
  certId,
  name,
  course,
  issuer,
  dateOfIssue,
  storedHash,
) => {
  const dataString = `${certId}|${name}|${course}|${issuer}|${dateOfIssue}`;
  return await bcrypt.compare(dataString, storedHash);
};

/* ---------------- TEST ---------------- */

(async () => {
  // Generate original hash (store in DB)
  const storedHash = await generateCertificateHash(
    "CERT-2024-000001",
    "John Doe",
    "Blockchain 101",
    "OpenAI Academy",
    "11/11/2024",
  );

  console.log("Stored Hash:", storedHash);

  // Valid verification (same data)
  const valid = await verifyCertificate(
    "CERT-2024-000001",
    "John Doe",
    "Blockchain 101",
    "OpenAI Academy",
    "11/11/2024",
    storedHash,
  );

  console.log("Certificate valid:", valid); // true

  // Tampered verification (course changed)
  const tampered = await verifyCertificate(
    "CERT-2024-000001",
    "John Doe",
    "Blockchain ADVANCED",
    "OpenAI Academy",
    "11/11/2024",
    storedHash,
  );

  console.log("Certificate valid after tampering:", tampered); // false
})();

module.exports = generateCertificateHash;

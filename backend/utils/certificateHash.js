const bcrypt = require("bcryptjs");

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

(async () => {
  const storedHash = await generateCertificateHash(
    "CERT-2024-000001",
    "John Doe",
    "Blockchain 101",
    "OpenAI Academy",
    "11/11/2024",
  );

  console.log("Stored Hash:", storedHash);

  const valid = await verifyCertificate(
    "CERT-2024-000001",
    "John Doe",
    "Blockchain 101",
    "OpenAI Academy",
    "11/11/2024",
    storedHash,
  );

  console.log("Certificate valid:", valid);

  const tampered = await verifyCertificate(
    "CERT-2024-000001",
    "John Doe",
    "Blockchain ADVANCED",
    "OpenAI Academy",
    "11/11/2024",
    storedHash,
  );

  console.log("Certificate valid after tampering:", tampered);
})();

module.exports = generateCertificateHash;

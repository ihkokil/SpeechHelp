
interface Country {
  name: string;
  code: string;
  dialCode: string;
}

const countries: Country[] = [
  { name: "United States", code: "US", dialCode: "1" },
  { name: "United Kingdom", code: "GB", dialCode: "44" },
  { name: "Canada", code: "CA", dialCode: "1" },
  { name: "Australia", code: "AU", dialCode: "61" },
  { name: "Germany", code: "DE", dialCode: "49" },
  { name: "France", code: "FR", dialCode: "33" },
  { name: "Italy", code: "IT", dialCode: "39" },
  { name: "Spain", code: "ES", dialCode: "34" },
  { name: "Netherlands", code: "NL", dialCode: "31" },
  { name: "Belgium", code: "BE", dialCode: "32" },
  { name: "Switzerland", code: "CH", dialCode: "41" },
  { name: "Austria", code: "AT", dialCode: "43" },
  { name: "Sweden", code: "SE", dialCode: "46" },
  { name: "Norway", code: "NO", dialCode: "47" },
  { name: "Denmark", code: "DK", dialCode: "45" },
  { name: "Finland", code: "FI", dialCode: "358" },
  { name: "Ireland", code: "IE", dialCode: "353" },
  { name: "Portugal", code: "PT", dialCode: "351" },
  { name: "Greece", code: "GR", dialCode: "30" },
  { name: "Poland", code: "PL", dialCode: "48" },
  { name: "Czech Republic", code: "CZ", dialCode: "420" },
  { name: "Hungary", code: "HU", dialCode: "36" },
  { name: "Russian Federation", code: "RU", dialCode: "7" },
  { name: "Japan", code: "JP", dialCode: "81" },
  { name: "China", code: "CN", dialCode: "86" },
  { name: "India", code: "IN", dialCode: "91" },
  { name: "Brazil", code: "BR", dialCode: "55" },
  { name: "Mexico", code: "MX", dialCode: "52" },
  { name: "Argentina", code: "AR", dialCode: "54" },
  { name: "South Africa", code: "ZA", dialCode: "27" },
  { name: "New Zealand", code: "NZ", dialCode: "64" },
  { name: "Singapore", code: "SG", dialCode: "65" },
  { name: "Hong Kong", code: "HK", dialCode: "852" },
  { name: "United Arab Emirates", code: "AE", dialCode: "971" },
  { name: "Israel", code: "IL", dialCode: "972" }
];

export default countries;

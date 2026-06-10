import { CountryConfig } from '../types';

export const countriesList: CountryConfig[] = [
  {
    name: 'India',
    code: '+91',
    cities: [
      'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Goa',
      'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna',
      'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivli',
      'Vasai-Virar', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad',
      'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur',
      'Kota', 'Guwahati', 'Chandigarh', 'Solapur', 'Hubli-Dharwad', 'Bareilly', 'Moradabad', 'Mysore', 'Gurgaon',
      'Aligarh', 'Jalandhar', 'Tiruchirappalli', 'Bhubaneswar', 'Salem', 'Warangal', 'Mira-Bhayandar',
      'Thiruvananthapuram', 'Bhiwandi', 'Saharanpur', 'Guntur', 'Amravati', 'Noida', 'Bikaner', 'Kochi'
    ].sort(),
    digitsCount: 10
  },
  {
    name: 'United States',
    code: '+1',
    cities: ['New York', 'Los Angeles', 'Chicago', 'San Francisco', 'Miami', 'Seattle', 'Austin', 'Boston', 'Las Vegas'],
    digitsCount: 10
  },
  {
    name: 'United Kingdom',
    code: '+44',
    cities: ['London', 'Manchester', 'Birmingham', 'Edinburgh', 'Glasgow', 'Liverpool'],
    digitsCount: 10
  },
  {
    name: 'Canada',
    code: '+1',
    cities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'],
    digitsCount: 10
  },
  {
    name: 'Australia',
    code: '+61',
    cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
    digitsCount: 9
  },
  {
    name: 'Germany',
    code: '+49',
    cities: ['Berlin', 'Munich', 'Frankfurt', 'Hamburg', 'Cologne'],
    digitsCount: 10
  },
  {
    name: 'France',
    code: '+33',
    cities: ['Paris', 'Marseille', 'Lyon', 'Nice', 'Toulouse'],
    digitsCount: 9
  },
  {
    name: 'Japan',
    code: '+81',
    cities: ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Nagoya'],
    digitsCount: 10
  },
  {
    name: 'United Arab Emirates',
    code: '+971',
    cities: ['Dubai', 'Abu Dhabi', 'Sharjah'],
    digitsCount: 9
  }
];

import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';
import { Asn, City, Country, Reader } from '@maxmind/geoip2-node';

const databaseDirectory = process.env.GEOIP_DATABASE || '/var/lib/GeoIP';
const asnDatabasePath = path.join(databaseDirectory, 'GeoLite2-ASN.mmdb');
const cityDatabasePath = path.join(databaseDirectory, 'GeoLite2-City.mmdb');
const countryDatabasePath = path.join(databaseDirectory, 'GeoLite2-Country.mmdb');

function getAsn(ipAddress: string): Asn | null {
  if (!fs.existsSync(asnDatabasePath)) {
    console.warn('ASN database file not found.');
    return null;
  }
  const buffer = fs.readFileSync(asnDatabasePath);
  const reader = Reader.openBuffer(buffer);
  try {
    const data = reader.asn(ipAddress);
    return data;
  } catch (error) {
    console.warn('ASN data not found for IP:', ipAddress);
    return null;
  }
}

function getCity(ipAddress: string): City | null {
  if (!fs.existsSync(cityDatabasePath)) {
    console.warn('City database file not found.');
    return null;
  }
  const buffer = fs.readFileSync(cityDatabasePath);
  const reader = Reader.openBuffer(buffer);
  try {
    const data = reader.city(ipAddress);
    return data;
  } catch (error) {
    console.warn('City data not found for IP:', ipAddress);
    return null;
  }
}

function getCountry(ipAddress: string): Country | null {
  if (!fs.existsSync(countryDatabasePath)) {
    console.warn('Country database file not found.');
    return null;
  }
  const buffer = fs.readFileSync(countryDatabasePath);
  const reader = Reader.openBuffer(buffer);
  try {
    const data = reader.country(ipAddress);
    return data;
  } catch (error) {
    console.warn('Country data not found for IP:', ipAddress);
    return null;
  }
}

function getGeoIp(ipAddress: string): { asn: Asn | null; city: City | null; country: Country | null } {
  const asn = getAsn(ipAddress);
  const city = getCity(ipAddress);
  const country = getCountry(ipAddress);
  return { asn, city, country };
}

export { getGeoIp };

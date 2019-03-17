import gspread
from oauth2client.service_account import ServiceAccountCredentials
import serial
import subprocess
import ambient


amb = ambient.Ambient(8860,"ambient_key")
scope = ['https://spreadsheets.google.com/feeds']
credentials = ServiceAccountCredentials.from_json_keyfile_name('hoge.json', scope)
gc = gspread.authorize(credentials)
worksheet = gc.open_by_key("spreadsheet_key").sheet1

def sensor():
    ser = serial.Serial('/dev/ttyS0',baudrate=9600,bytesize=serial.EIGHTBITS,parity=serial.PARITY_NONE,stopbits=serial.STOPBITS_ONE,timeout=1.0)
    
    while 1:
        result=ser.write("\xff\x01\x86\x00\x00\x00\x00\x00\x79")
        s=ser.read(9)
        if s[0] == "\xff" and s[1] == "\x86":
            return {'co2': ord(s[2])*256 + ord(s[3])}
        break
    
def read():
    p = subprocess.call('sudo systemctl stop serial-getty@ttyS0.service', stdout=subprocess.PIPE, shell=True)
    result = sensor()
    p = subprocess.call('sudo systemctl start serial-getty@ttyS0.service', stdout=subprocess.PIPE, shell=True)
    if result is not None:
        return {'d1': result["co2"]}

if __name__ == '__main__':
    value = read()
    if value is not None:
        print value["d1"],"ppm"
        r = amb.send({'d1' : value['d1']})	
        print(r.status_code)
        r.close()
        if value["d1"] > 1000:
            print worksheet.cell(1,3)
            worksheet.update_cell(1,3, str(value["d1"])+"ppm")

    else:
        print "None"


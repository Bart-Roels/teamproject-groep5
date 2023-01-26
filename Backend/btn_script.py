import RPi.GPIO as GPIO
from time import sleep,time
from subprocess import call

# PINf
power = 6

def setup():
    GPIO.setmode(GPIO.BCM) 
    GPIO.setwarnings(False)
    GPIO.setup(power, GPIO.IN, GPIO.PUD_UP)
    GPIO.add_event_detect(power,GPIO.FALLING,demo_callback,bouncetime=2000)

def demo_callback(pin):
    global teller
    status = call(["systemctl", "is-active", "--quiet", "mijnproject"])
    # print(status)
    if status != 0:
        call("sudo systemctl start mijnproject.service", shell=True)
        print('ON')
    else:
        sleep(1)
        call("sudo systemctl stop mijnproject.service", shell=True)
        print('OFF')


try:
    print("Powerbutton")
    setup()
    start_time = 0
    status = False
    while True:
        try:
            if GPIO.input(power) == 0 and status == False:
                start_time = time()
                status = True
            if GPIO.input(power) == 1:
                status = False
            if status == True:
                if(time()-start_time)>10:
                    print('SUDO POWEROFF')
                    if call(["systemctl", "is-active", "--quiet", "mijnproject"]) == 0:
                        call("sudo systemctl stop mijnproject.service", shell=True)
                    print("**** DB --> Pi is shutting down ****")
                    sleep(2)
                    call("sudo poweroff", shell=True)
                if(time()-start_time)>3:
                    print('SUDO REBOOT')
                    if call(["systemctl", "is-active", "--quiet", "mijnproject"]) == 0:
                        call("sudo systemctl stop mijnproject.service", shell=True)
                    print("**** DB --> Pi is rebooting ****")
                    sleep(2)
                    call("sudo reboot", shell=True)
        except Exception as e:
            print(e)
except Exception as e:
    print(e)
    GPIO.cleanup()
import time
import RPi.GPIO as GPIO
import os

GPIO.setmode(GPIO.BCM)

button_pin = 6
GPIO.setup(button_pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.add_event_detect(button_pin, GPIO.RISING, bouncetime=200)

def handle_button(channel):
    # code to shutdown the pi
    print("Shutting Down")
    os.system("sudo poweroff")


# import time
# import RPi.GPIO as GPIO

# GPIO.setmode(GPIO.BCM)

# button_pin = 6
# GPIO.setup(button_pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)

# def handle_button(channel):
#     global start_time
#     if GPIO.input(button_pin):
#         print("Button Released")
#         end_time = time.time()
#         time_diff = end_time - start_time
#         print("Time Difference: ", time_diff)
#         if 0 < time_diff < 3:
#             print("Reboot")
#         elif time_diff >= 3:
#             print("Shutting Down")
#         GPIO.remove_event_detect(button_pin)
#         GPIO.add_event_detect(button_pin, GPIO.RISING, callback=handle_button, bouncetime=200)
#     else:
#         print("Button Pressed")
#         start_time = time.time()
#         GPIO.remove_event_detect(button_pin)
#         GPIO.add_event_detect(button_pin, GPIO.FALLING, callback=handle_button, bouncetime=200)

# GPIO.add_event_detect(button_pin, GPIO.RISING, callback=handle_button, bouncetime=200)

# try:
#     while True:
#         pass
# except KeyboardInterrupt:
#     print("Exiting Program")

# GPIO.cleanup()
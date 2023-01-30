import time
import RPi.GPIO as GPIO

# Set the GPIO numbering mode
GPIO.setmode(GPIO.BCM)

# Start time
start_time = None 
end_time = None

# Set the input pin for the button
button_pin = 6
GPIO.setup(button_pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)

# Define the functions to be called when the button is pressed or released
def button_pressed(channel):
    global start_time
    print("Button Pressed")
    # Note start time
    start_time = time.time()

    GPIO.remove_event_detect(button_pin)
    GPIO.add_event_detect(button_pin, GPIO.FALLING, callback=button_released, bouncetime=200)

def button_released(channel):
    global end_time
    global start_time
    print("Button Released")
    # Note end time
    end_time = time.time()
    # Calculate the time difference
    time_diff = end_time - start_time
    print("Time Difference: " + str(time_diff))
    # If the time is between 0 and 3 then print reboot
    if time_diff > 0 and time_diff < 3:
        print("Rebooting")
    # If the time is between 4 and 10 then print shutdown
    elif time_diff > 4 and time_diff < 10:
        print("Shutting Down")
    GPIO.remove_event_detect(button_pin)
    GPIO.add_event_detect(button_pin, GPIO.RISING, callback=button_pressed, bouncetime=200)

# Set the initial event detection for the button press
GPIO.add_event_detect(button_pin, GPIO.RISING, callback=button_pressed, bouncetime=200)

# Wait for the button press and release
try:
    while True:
        pass
except KeyboardInterrupt:
    print("Exiting Program")

# Clean up the GPIO setup
GPIO.cleanup()
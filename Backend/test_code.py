import random
def random_getallen():
    return random.sample(range(4), 2)


for i in range(100):
    print(random_getallen())

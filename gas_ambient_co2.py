    p = subprocess.call('sudo systemctl stop serial-getty@ttyS0.service', stdout=subprocess.PIPE, shell=True)

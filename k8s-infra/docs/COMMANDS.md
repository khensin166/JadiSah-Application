# Command untuk menjalankan playbook ansible
cd /mnt/d/eksplor/JadiSah-Application/k8s-infra/ansible

# (Karena dijalankan di WSL pada drive D: yang writable, kita gunakan ANSIBLE_CONFIG eksplisit)

# 1. Jalankan Preparation & Validasi Tailscale
ANSIBLE_CONFIG=ansible.cfg ansible-playbook playbooks/prepare.yml -K
ANSIBLE_CONFIG=ansible.cfg ansible-playbook playbooks/tailscale.yml -K

# 2. Instalasi K3s Server
ANSIBLE_CONFIG=ansible.cfg ansible-playbook playbooks/k3s-server.yml -K

#jds BECOME password: S1b3r!@#

# 3. Instalasi K9s
ANSIBLE_CONFIG=ansible.cfg ansible-playbook playbooks/k9s.yml -K

# 4. Standarisasi Firewall (UFW) Seluruh Node (Master & Worker)
ANSIBLE_CONFIG=ansible.cfg ansible-playbook playbooks/firewall.yml -K

# 5. Akses SSH ke Worker via Jump Host (Master)
ssh -i ~/.ssh/jadi_sah.pem -J jds@100.79.211.49 fjr@192.168.1.30

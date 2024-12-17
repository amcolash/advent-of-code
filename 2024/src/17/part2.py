import math

A = 0
B = 0
C = 0
IP = 0

output = []
program = [2,4,1,3,7,5,4,0,1,3,0,3,5,5,3,0]

def convert_combo(operand):
  global A, B, C
  if operand in [0, 1, 2, 3]:
    return operand
  elif operand == 4:
    return A
  elif operand == 5:
    return B
  elif operand == 6:
    return C
  elif operand == 7:
    raise ValueError("Combo 7 is reserved")
  else:
    raise ValueError("Invalid operand")

def adv(combo):
  global A, IP
  value = convert_combo(combo)
  A = math.floor(A / (2 ** value))
  IP += 2

def bxl(literal):
  global B, IP
  B = (B ^ literal) & 0xFFFFFFFF
  IP += 2

def bst(combo):
  global B, IP
  value = convert_combo(combo)
  B = value % 8
  IP += 2

def jnz(literal):
  global IP
  if A == 0:
    IP += 2
  else:
    IP = literal

def bxc(noop):
  global B, IP
  B = (B ^ C) & 0xFFFFFFFF
  IP += 2

def out(combo):
  global IP
  value = convert_combo(combo) % 8
  output.append(value)
  if output[0] != program[0]:
    raise Exception("Exit Early")
  IP += 2

def bdv(combo):
  global B, IP
  value = convert_combo(combo)
  B = math.floor(A / (2 ** value))
  IP += 2

def cdv(combo):
  global C, IP
  value = convert_combo(combo)
  C = math.floor(A / (2 ** value))
  IP += 2

# List of functions to map opcodes to operations
instruction_map = [adv, bxl, bst, jnz, bxc, out, bdv, cdv]
instruction_names = ['adv', 'bxl', 'bst', 'jnz', 'bxc', 'out', 'bdv', 'cdv']

def runProgram():
  global B, C, IP, output
  B = 0
  C = 0
  IP = 0
  output = []

  while IP < len(program):
    opcode = program[IP]
    operand = program[IP + 1]
    instruction_map[opcode](operand)

def prevalidate(digit):
  global A, B, C

  # check adv 3 FIRST
  if math.floor(A / 8) == 0: return False

  #  bst 4
  #  B = A % 8;

  #  bxl 3
  #  B = B ^ 3;

  #  bst 4 + bxl 3
  B = (A % 8) ^ 3

  # cdv 5
  C = math.floor(A / (2 ** B))

  # bxc 0
  # B = B ^ C;

  # bxl 3
  # B = B ^ 3;

  # bxc 0 + bxl 3
  B = (B ^ C) ^ 3

  # adv 3 (checked at top, but still needs to be set)
  A = math.floor(A / 8)

  # jnz 0 (only jump if A !== 0)

  return B % 8 == digit

best = 0

for i in range(0, 1000000000):
  start = i * 8 ** 11 + 0o30145714775
  # start = i
  # * Math.pow(8, 13) + 0o1130145714775;

  if start > 387031340915197:
    print("FAILED")
    break


  A = start
  B = 0
  C = 0

  # if i % 10000000 == 0: print(start)

  # 387031340915197 is too high
  # 108107574778365

  skip = False
  for j in range(0, 15):
    valid = prevalidate(program[j])

    if not valid:
      skip = True
      break

    if valid and j > best and j > 14:
      print(j, oct(start), start) # here are some of the end digits (octal) 0o3014, 0o5714775, 0o130145714775
      best = j

  if not skip:
    A = start
    runProgram()

    if output == program:
      print("Success", oct(start), start)


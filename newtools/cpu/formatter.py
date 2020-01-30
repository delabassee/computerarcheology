
import cpu.cpu_8052 as CPU


for op in CPU.OPCODES:
    if 'mnem' in op:
        m = op['mnem']
    elif 'mnemonic' in op:
        m = op['mnemonic']
        
    c = op['code']
    
    if 'bus' in op:
        b = op['bus']
    elif 'use' in op:
        b = op['use']  
        
    b = '"'+b+'",'
    b = b.ljust(10)
    
    c = '"'+c+'",'
    c=c.ljust(20)
    
    m = '"'+m+'",'
    m = m.ljust(20)
        
    print('{"mnemonic":'+m+'"code":'+c+    '"use":'+b+   '},')
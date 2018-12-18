import shutil
import os
from web.nav_tree import NavTree
from web.id_mgr import IDMgr
import web.ENVIRONMENT as ENV
import code.markdown_line
import copy

def substitute(lines,tag,value):
    tag = '<!-- %%'+tag+'%% -->'
    for i in range(len(lines)):
        if tag in lines[i]:
            lines[i] = lines[i].replace(tag,value)

def process_markdown(lines,site_nav_node):
    
    print("CRUMBS:"+site_nav_node.get_full_path())
               
    # Used to make unique anchor ids on this page    
    ids = IDMgr()
    
    # Used to build the page's navigation tab
    page_nav = NavTree()
    
    # All the different pieces of the page
    ret = {}
    
    # The HTML content of the page
    content = '' 
        
    # Image and Title ... both before the first header
    for g in lines:
        if g.startswith('#'):
            break
        if g.startswith('!['):
            i = g.index('](')
            ret['TITLE'] = g[2:i].strip()            
            j = g.rindex(')')
            ret['IMAGE'] = g[i+2:j].strip()
            if ret['TITLE']=='':
                ret['TITLE'] = ret['IMAGE'][0:ret['IMAGE'].rindex('.')]
            break
        
        
       
        
    # Line by line from the top ... here we go    
    for i in range(len(lines)):
        # Keeping the index in case we have to look backwards
        line = lines[i]
        line_strip = line.strip()
        
        # Build the page tree while we are processing the file
        if(line_strip.startswith('#')):
            level = 0
            while line[level]=='#':
                level = level + 1                
            text = line[level:].strip()
            anchor = ids.add_id(text)
            page_nav.add_page_nav(level,text,anchor)
            content += '<h{level} id="{anchor}">{text}</h{level}>\n'.format(level=level,anchor=anchor,text=text)
    
        
    
    ret['PAGE_TREE'] = page_nav.to_html(True)      
    ret['CONTENT'] = content   
    
    spec_site_nav = copy.deepcopy(site_nav)
    # TODO open path
        
    ret['BREAD_CRUMBS'] = 'crumbs'
    ret['SITE_TREE'] = spec_site_nav.to_html()    
    
    # Some basic error checking
    if ret['IMAGE']=='' or ret['TITLE']=='':
        raise Exception('IMAGE and TITLE are required')
        
    return ret

def deploy_directory(current_node):
    
    fp_content = os.path.join(ENV.CONTENT_DIR,current_node.get_full_path())
    fp_deploy  = os.path.join(ENV.DEPLOY_DIR,current_node.get_full_path())
    if fp_deploy.endswith('\\'):
        fp_deploy = fp_deploy[:-1]
    
    for dep in current_node.invisibles:
        if dep.startswith('+'):
            # This is just a blind copy -- no processing
            dep = dep[1:].strip()
            src = os.path.join(fp_content,dep)
            dst = os.path.join(fp_deploy,dep)                        
            if os.path.isdir(src):
                shutil.copytree(src,dst)
            else:
                shutil.copy(src,dst)
                
    for dep in current_node.children:
        src = os.path.join(fp_content,dep.anchor)
        dst = os.path.join(fp_deploy,dep.anchor)
        if os.path.isdir(src):
            os.makedirs(dst)            
            deploy_directory(dep)        
        else:
            f = open(src,'r')
            cont = f.readlines()
            cont = process_markdown(cont,dep)
            f = open(os.path.join(ENV.CONTENT_DIR,'master.template'),'r')
            lines = f.readlines()
            f.close()
            substitute(lines,'TITLE',cont['TITLE'])
            substitute(lines,'IMAGE',cont['IMAGE'])
            substitute(lines,'BREAD_CRUMBS',cont['BREAD_CRUMBS'])
            substitute(lines,'SITE_TREE',cont['SITE_TREE'])
            substitute(lines,'PAGE_TREE',cont['PAGE_TREE'])
            substitute(lines,'CONTENT',cont['CONTENT'])                
            if dep.anchor=='README.md':
                dep.anchor = 'index.html'
            else:
                dep.anchor = dep.anchor[0:-2]+'html'
            f = open(os.path.join(ENV.DEPLOY_DIR,dep.get_full_path()),'w+')
            f.writelines(lines)
            f.close()                

def load_site_directory(level=None,tree=None,current_node=None):
    
    if tree==None:
        tree = NavTree()       
        level = 1
        current_node = tree.root
        
    src = os.path.join(ENV.CONTENT_DIR,current_node.get_full_path())
    lines = code.markdown_line.load_file(os.path.join(src,'README.md'))
    info = code.markdown_line.get_deploy(lines)  
            
    for directory,title in info:
        if directory.startswith('+'):            
            # These do not contribute to navigation
            current_node.invisibles.append(directory)            
        elif os.path.isdir(os.path.join(src,directory)):
            # This is a directory. Make an entry and recurse into it
            n = tree.add_page_nav(level,title,directory)
            load_site_directory(level+1,tree,n)
        else:        
            # This is a file
            tree.add_page_nav(level,title,directory)    
            
    return tree

if __name__ == '__main__':
    
    site_nav = load_site_directory()    
    
    if os.path.isdir(ENV.DEPLOY_DIR):
        shutil.rmtree(ENV.DEPLOY_DIR)    
    os.makedirs(ENV.DEPLOY_DIR)
    
    deploy_directory(site_nav.root)
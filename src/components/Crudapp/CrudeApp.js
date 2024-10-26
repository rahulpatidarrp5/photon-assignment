import React, {useEffect, useState} from 'react';
import { Button ,Modal, Form,Table} from 'react-bootstrap';
import axios from 'axios';
import './Modalstyle.css';

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

const CrudeApp =()=>{
const [post, setPost] = useState([]);
const [showmodal, setShowModal] = useState(false);
const [formData, setFormData] = useState({title:'', body:''});
const [editMode, setEditMode]= useState(false);
const [currentPostId, setCurrentPostId]=useState(null);


useEffect(()=>{
 const storedPost = JSON.parse(localStorage.getItem('post'));


 if (storedPost && storedPost.length > 0){
    setPost(storedPost);
 }else{
    const fetchPosts = async () =>{
        try{
            const response = await axios.get(API_URL);
            const initialPost = response.data;
            
            setPost(initialPost) 
            localStorage.setItem('post',JSON.stringify(initialPost))
        }
        catch (error){
          console.log('error handling', error)
        }
    }
    fetchPosts();
 }

 
},[])


useEffect(()=>{
    localStorage.setItem('post',JSON.stringify(post))
},[post])

const handleInputChange = (e) =>{
   const {name,value} =  e.target;
   setFormData({...formData, [name]:value});
   
}

const handleShowModal = () =>{
    setShowModal(true);
}

const handleCloseModal = () =>{
    setShowModal(false);
}

const handleEditPost = (post) =>{
    console.log('editpost',post)
setEditMode(true);
setFormData({title: post.title, body:post.body})
setCurrentPostId(post.id);
setShowModal(true);
}

const handleSavePost = () =>{
    if(editMode){
        setPost(post.map((post)=>post.id === currentPostId ? {...post, ...formData}: post));
    }else{
        const newPost = {...formData, id:Date.now()};
        setPost([newPost, ...post]);
    }
    setFormData({title:'', body:''});
    setEditMode(false);
    handleCloseModal();
}

const handleDeletePost = (id) =>{
setPost(post.filter((post)=>post.id !== id))
}

return(
    <div className='container mt-5'>
  <h1> Post List</h1>
  <Button className='mb-3' onClick={handleShowModal}>Add Post</Button>

  <Table striped bordered hover>
    <thead>
        <tr>
            <th>Title</th>
            <th>Body</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody>
        {post.map((post)=>{
            return(
                <tr key={post.id}>
   <td>{post.title}</td>
   <td>{post.body}</td>
   <td>
       <Button variant='warning' className=' me-2' onClick={()=>handleEditPost(post)}>Edit</Button>
       <Button  variant='danger'  onClick={()=>handleDeletePost(post.id)}>Delete</Button>
   </td>
</tr>
            )
   
        })} 
        
    </tbody>
  </Table>

  <Modal  show={showmodal} onHide={handleCloseModal}>
    <Modal.Header closeButton>
        <div className='modal-title-left'>
        <Modal.Title className='w-100 text-start'>{editMode ? 'Edit Post' : 'Add New Post'}</Modal.Title>
        </div>
        <div className='modal-content'>
        <Modal.Body className='modal-body'>
            <Form>
                <Form.Group>
                    <Form.Label>Title</Form.Label>
                    <Form.Control type='text' name='title' value={formData.title} onChange={handleInputChange}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Body</Form.Label>
                    <Form.Control type='textarea' name='body' value={formData.body} onChange={handleInputChange}/>
                </Form.Group>
            </Form>
        </Modal.Body>
        </div>
    </Modal.Header>
    <Modal.Footer className='modal-footer'>
        <Button variant='secondary' onClick={handleCloseModal}>Close</Button>
        <Button variant='primary' onClick={handleSavePost}>{editMode ? 'Edit Post' : 'Add Post'}</Button>
    </Modal.Footer>
  </Modal>
    </div>
)
}

export default CrudeApp;
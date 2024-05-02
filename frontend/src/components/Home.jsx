import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import CardMedia from '@mui/material/CardMedia';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import PersonIcon from '@mui/icons-material/Person';
import ScheduleIcon from '@mui/icons-material/Schedule';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';

const useStyles = makeStyles((theme) => ({
  container: {
    marginBottom: theme.spacing(2),
  },
  filterContainer: {
    marginBottom: theme.spacing(2),
  },
  postContainer: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  mediaContainer: {
    flex: '0 0 auto',
    marginRight: theme.spacing(2),
  },
  media: {
    borderRadius: theme.shape.borderRadius,
    objectFit: 'cover',
    maxHeight: 200,
    maxWidth: '100%',
  },
  textContainer: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1),
  },
  icon: {
    marginRight: theme.spacing(1),
  },
}));

const Home = () => {
  const classes = useStyles();
  const [postData, setPostData] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [openModal, setOpenModal] = useState(false);
  const [newPostData, setNewPostData] = useState({
    title: '',
    category: '',
    content: '',
    media: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://masaiforum-x4u7.onrender.com/api/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setPostData(data);
        // console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (event) => {
    setFilterCategory(event.target.value);
  };

  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPostData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };


  const handleAddPost = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const token = userData.token;
  
      const response = await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`  
        },
        body: JSON.stringify(newPostData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to add post');
      }
      const data = await response.json();
      console.log('New post added:', data);
      setOpenModal(false);
      // Optionally, you can update the state with the new post
      // setPostData(prevData => [...prevData, data]);
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };
  

  if (!postData) {
    return <Typography>Loading...</Typography>;
  }

  const filteredPosts = filterCategory !== 'All' ? postData.filter(post => post.category === filterCategory) : postData;

  return (
    <div className={classes.container}>
      <div className={classes.filterContainer}>
        <FormControl>
          <Select
            value={filterCategory}
            onChange={handleFilterChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Category' }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Innovation">Innovation</MenuItem>
            <MenuItem value="Design">Design</MenuItem>
            <MenuItem value="Development">Development</MenuItem>
            <MenuItem value="Tutorial">Tutorial</MenuItem>
            <MenuItem value="Business">Business</MenuItem>
          </Select>
        </FormControl>
      </div>
      <Button variant="contained" color="primary" onClick={handleModalOpen}>
        Add Post
      </Button>
      <Grid container spacing={2}>
        {filteredPosts.map((post) => (
          <Grid item xs={12} key={post._id}>
            <Paper elevation={0} className={classes.postContainer}>
              <div className={classes.mediaContainer}>
                {post.media && (
                  <CardMedia
                    component="img"
                    src={post.media[0]}
                    alt="Media"
                    className={classes.media}
                  />
                )}
              </div>
              <div className={classes.textContainer}>
                <Typography variant="h6" gutterBottom>
                  {post.title}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  Category: {post.category}
                </Typography>
                <Typography variant="body1" paragraph>
                  {post.content}
                </Typography>
                <div className={classes.iconContainer}>
                  <FavoriteIcon className={classes.icon} />
                  <Typography variant="body2">
                    Likes: {post.likes.length}
                  </Typography>
                </div>
                <div className={classes.iconContainer}>
                  <CommentIcon className={classes.icon} />
                  <Typography variant="body2">
                    Comments: {post.comments.length}
                  </Typography>
                </div>
                <div className={classes.iconContainer}>
                  <PersonIcon className={classes.icon} />
                  <Typography variant="body2">
                    User: {post.user_id.username}
                  </Typography>
                </div>
                <div className={classes.iconContainer}>
                  <ScheduleIcon className={classes.icon} />
                  <Typography variant="body2">
                    Created at: {new Date(post.created_at).toLocaleString()}
                  </Typography>
                </div>
              </div>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Dialog open={openModal} onClose={handleModalClose}>
        <DialogTitle>Add New Post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            type="text"
            fullWidth
            name="title"
            value={newPostData.title}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            id="category"
            label="Category"
            type="text"
            fullWidth
            name="category"
            value={newPostData.category}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            id="content"
            label="Content"
            type="text"
            fullWidth
            multiline
            rows={4}
            name="content"
            value={newPostData.content}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            id="media"
            label="Media URL"
            type="text"
            fullWidth
            name="media"
            value={newPostData.media}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose}>Cancel</Button>
          <Button onClick={handleAddPost} color="primary">Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Home;

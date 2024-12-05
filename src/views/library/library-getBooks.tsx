'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';

import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Divider, List } from '@mui/material';

// project import
import axios from 'utils/axios';
import { BookListItem, NoBooks } from 'components/MessageListItem';
import { IBook } from 'types/book';

const defaultTheme = createTheme();

export default function MessagesList() {
  const [Books, setBooks] = React.useState<IBook[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => {
    axios
      .get('closed/books/all')
      .then((response) => {
        setBooks(response.data );
        console.dir(response)
      })
      .catch((error) => console.error(error));
  }, []);

  const handleDelete = (isbn13: number) => {
    axios
      .delete('/closed/books/isbn/' + isbn13)
      .then((response) => {
        response.status == 200 && setBooks(Books.filter((Book) => Book.isbn13 !== isbn13));
      })
      .catch((error) => console.error(error));
  };

  const filteredBooks = Books.filter((book) => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.authors.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const booksAsComponents = filteredBooks
    .filter((Book) => Book.isbn13 != null && 
      (searchQuery === '' || 
       Book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       Book.authors.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .map((Book, index, Books) => (
    <React.Fragment key={'Book list item: ' + index}>
    <Box display="flex" alignItems="center" p={2}>
      {Book.image_small_url && (
        <img
          src={Book.image_small_url}
          alt={Book.title}
          style={{ width: 50, height: 75, marginRight: 16 }}
        />
      )}
      <Box flexGrow={1}>
        <Typography variant="h6">{Book.title}</Typography>
        <Typography variant="body2" color="textSecondary">
          {Book.authors}
        </Typography>
      </Box>
      <BookListItem book={Book} onDelete={handleDelete} />
        {index < Books.length - 1 && <Divider variant="middle" component="li" />}
    </Box>
    {index < Books.length - 1 && <Divider variant="middle" component="li" />}
  </React.Fragment>
  ));
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <MenuBookOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            View books in the library system
          </Typography>

          <Box sx={{ 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'flex-end',
            mt: 2, 
            mb: 2 
          }}>
            <TextField
              placeholder="Search books..."
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
            />
          </Box>

          <Box sx={{ mt: 1 }}>
            <List>{booksAsComponents.length ? booksAsComponents : <NoBooks/>}</List>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

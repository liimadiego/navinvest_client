import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Pagination,
  Stack,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'src/lib/axios';

export function NewsList() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 6;

  useEffect(() => {
    axios
      .get(`/news?page=${page}&per_page=${rowsPerPage}`)
      .then(({ data }) => {
        const formatted = (data.results ?? data).map((item) => ({
          id: item.uuid,
          title: item.title,
          summary: item.content,
          coverUrl: item.image_url,
        }));
        setItems(formatted);
        setTotalPages(data.total_pages ?? data.totalPages ?? 1);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [page]);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  return (
    <Box sx={{ px: { xs: '2%', md: '6%' } }}>
      <Stack spacing={3}>
        {items.map((item) => (
          <Card key={item.id}>
            <CardActionArea onClick={() => navigate(`/dashboard/noticias/${item.id}`)}>
              {item.coverUrl && (
                <CardMedia component="img" image={item.coverUrl} sx={{ height: 160 }} />
              )}
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.summary?.slice(0, 120)}...
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Stack>
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Pagination count={totalPages} page={page} onChange={handleChangePage} color="primary" />
      </Box>
    </Box>
  );
}

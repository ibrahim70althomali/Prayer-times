import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
 import axios from "axios"
const Prayers = ({n,s,i}) => {
  return (
    <>
     <Card sx={{ maxWidth: "400px",width:"250px"}}>
      <CardMedia
        component="img"
        alt="green iguana"
        height="140"
        image= {i}
      />
      <CardContent>
        <h3>
          {n}
        </h3>
        <Typography variant="h2" color="text.secondary">
           {s}
         </Typography>
      </CardContent>
    </Card>
    </>
  )
}

export default Prayers

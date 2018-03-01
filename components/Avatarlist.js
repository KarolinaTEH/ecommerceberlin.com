

import React from 'react'
import NextLink from 'next/link'
import get from 'lodash/get'
import {slug} from '../helpers'
import MyCard from './MyCard'
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';


const styles = {


};


const Link = ({data}) => (

   <NextLink  as={`/e,${1},${ slug(data.fields.cname2) }`} href={`/exhibitor?id=${ 1 }`}>

     <Button size="small" color="primary">
       WIĘCEJ
     </Button>

   </NextLink>

)


//xs, sm, md, lg, and xl.

class Avatarlist extends React.Component {

state = {

  showAll : false

}

toggleShowAll = () => {

  this.setState({showAll : !this.state.showAll});
}

render()
{

  const { data, classes } = this.props;
  const { showAll } = this.state;

  const _data = data.slice(0, showAll ? data.length : 6 );

  return (

<div>

  <Grid container spacing={16}>

    {data &&  _data.map(row =>

       <Grid item xs={12} sm={6} md={4} lg={3} xl={2} >
         <MyCard title={row.fields.cname2} text={get(row.fields, "booth")} link={ <Link data={row} />} />
       </Grid>
      )}

  </Grid>

  <Button variant="raised" onClick={this.toggleShowAll} />

</div>

);

}

}
export default withStyles(styles)(Avatarlist);

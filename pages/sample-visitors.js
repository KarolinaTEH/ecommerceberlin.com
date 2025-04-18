import React from 'react'

import {
  connect,
  MyHead as Head,
  MyLink as Link,
  WidgetSalesMap,
  WidgetIconGrid,
  //WidgetVideoWithReviews,
  WidgetAllExhibitorsAvatarlist,
  //DatasourceExhibitors,
  WidgetVips,
  Wrapper,
  Faq,
  reduxWrapper,
  configure
} from 'eventjuicer-site-components';



const settings = require('../settings').default;


const PageSampleVisitors = () => (
  <div>
  <WidgetVips first limit={10000} include={<div />} />

  <WidgetSalesMap
    label="exhibitors.map.title"
    secondaryLabel="exhibitors.map.opensales"
 
  />

  {/* <WidgetVideoWithReviews /> */}


  <WidgetIconGrid setting="exhibitors.benefits" icons={{

  }}/>


  <Wrapper label="exhibitors.faq.name">
    <Faq
      url="/exhibit"
      baseLabel="exhibitors.faq.become"
      items={[
        {
          label: 'included_services',
          important: true,
          buttons: [],
        },
        {
          baseLabel: 'exhibitors.faq.before_event',
          label: 'additional_paid_services',
        },
        { label: 'payment' },
        { label: 'onboarding' },
        { label: 'resignation' },
        { label: 'promo_benefits' },
        {
          baseLabel: 'exhibitors.faq.before_event',
          label: 'public_profile',
        },
      ]}
    />
  </Wrapper>

  <WidgetAllExhibitorsAvatarlist label="exhibitors.list_full" />
  </div>
)

 

export const getStaticProps = reduxWrapper.getStaticProps(async (props) => {

  await configure(props, {
    settings : settings,
    preload : ["exhibitors", "allexhibitors"]
  })

  return {props: {}, revalidate: 36000}

})

export default connect()(PageSampleVisitors);

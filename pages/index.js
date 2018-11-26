import {
  connect,
  LayoutMain as Layout,
  MyHead as Head,
  MyLink as Link,
  FsVideo,
  WidgetVideoWithEventInfo,
  WidgetVideoWithReviews,
  WidgetVisitor,
  WidgetFeaturedExhibitors,
  WidgetAllExhibitorsColumnList,
  WidgetRoleButtons,
  WidgetSalesMap,
  WidgetPresenters,
  WidgetSchedule,
  WidgetExhibitors,
} from 'eventjuicer-site-components';

class PageIndex extends React.Component {
  static async getInitialProps({ query, isServer, store }) {
    return {
      preload: ['exhibitors'],
      //    load : ["bookingmap", "formdata", "ticketgroups"]
    };
  }

  render() {
    return (
      <Layout>
        <Head />

        <WidgetVideoWithEventInfo />

        <WidgetSchedule />

        <WidgetVisitor
          label="visitors.register"
          secondaryLabel="event.parties"
        />

        <WidgetRoleButtons />

        <WidgetPresenters />

        <WidgetVisitor
          label="visitors.register_alt"
          secondaryLabel="event.parties"
        />

        <WidgetSalesMap
          label="exhibitors.map.title2"
          secondaryLabel="exhibitors.map.opensales"
        />

        <WidgetFeaturedExhibitors
          label="exhibitors.list_featured"
          secondaryTitle=""
          links={[
            <Link
              key="all"
              href="/exhibitors"
              label="common.menu.visitors.exhibitors"
              variant="text"
              color="secondary"
            />,
          ]}
        />

        <WidgetVideoWithReviews />

        {/*
<Photos>{
(photos, size) => <Gallery data={photos} size={size} label="event.gallery" />
}</Photos> */}

        <WidgetAllExhibitorsColumnList />

        <FsVideo
          background="https://res.cloudinary.com/eventjuicer/image/upload/v1534553598/poster_stage1.jpg"
          videoSrc="https://res.cloudinary.com/eventjuicer/video/upload/v1534553583/video_stage1.mp4"
        />

        <WidgetVisitor
          label="visitors.register"
          secondaryLabel="event.parties"
        />
      </Layout>
    );
  }
}

export default connect(
  null,
  null,
)(PageIndex);

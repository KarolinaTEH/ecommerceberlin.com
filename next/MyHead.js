

import NextHead from 'next/head';
import { string } from 'prop-types';
import { translate } from '../i18n'
import { fullUrl, prepareForTranslate } from '../helpers'


const Head = ({title, description, url, image, translate}) => {

  const titleParams = prepareForTranslate(title)
  const descParams = prepareForTranslate(description)

  const tTitle = translate(titleParams.str, titleParams.params)
  const tDescription = description ? translate(descParams.str, descParams.params) : description

  const prefixedUrl = fullUrl(url)

  return (
    <NextHead>
      <meta charSet="UTF-8" />
      <title>{ tTitle }</title>
      <meta name="description" content={ tDescription } />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {/* <link rel="icon" sizes="192x192" href="/static/touch-icon.png" />
      <link rel="apple-touch-icon" href="/static/touch-icon.png" />
      <link rel="mask-icon" href="/static/favicon-mask.svg" color="#49B882" />
      <link rel="icon" href="/static/favicon.ico" /> */}
      <meta property="og:url" content={ prefixedUrl } />
      <meta property="og:title" content={ tTitle || ''} />
      <meta property="og:description" content={ tDescription } />
      <meta name="twitter:site" content={ prefixedUrl } />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={ image } />
      <meta property="og:image" content={ image } />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
    </NextHead>
  );
}

Head.defaultProps = {
  title: "",
  description: "",
  image: "",
  url : ""
}


Head.propTypes = {
//  title: string,
  description: string,
  url: string,
  image: string,
};

export default translate(Head);

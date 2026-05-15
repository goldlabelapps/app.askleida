a good image

```javascript
<Box sx={{mx: 0, mt: 0}}>

            {/* Show CardMedia with Skeleton preloader if image is a non-empty string */}
            {typeof image === 'string' && image.trim() ? (
              <Box sx={{ width: '100%', m: 0, p: 0, position: 'relative', overflow: 'hidden' }}>
                {!imgLoaded && (
                  <Skeleton variant="rectangular" width="100%" height={350} />
                )}

                  <CardHeader
                    sx={{ mx: 2 }}
                    title={title || 'No title'}
                    subheader={description || 'No description'}
                    avatar={icon ? <Icon icon={icon as any} color="primary" /> : null}
                  />
                <CardMedia
                  component="img"
                  image={image}
                  alt={title || 'image'}
                  sx={{
                    display: imgLoaded ? 'block' : 'none',
                    width: '100%',
                    height: 300,
                    maxHeight: 300,
                    objectFit: 'cover',
                    objectPosition: 'center',
                    borderRadius: 0,
                    mt: 1
                  }}
                  onLoad={() => setImgLoaded(true)}
                  onError={() => setImgLoaded(true)}
                />
              </Box>
            ) : null}
            </Box>
            ```
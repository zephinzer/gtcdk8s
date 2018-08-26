import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import moment from 'moment';
import { Toolbar, Typography, TextField, Paper, FormGroup, FormControlLabel, InputLabel, Button, Divider, Switch, Grid } from '@material-ui/core';

export default class HomeComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      editPosts: false,
    };
  }

  componentDidMount() {
    console.info(this.props.dispatch.getAllPosts());
  }

  render() {
    return (
      <div
        className="home"
      >
        <AppBar position="static">
          <Toolbar>
            <Grid container>
              <Grid item xs={8} style={{padding: '16px'}}>
                <Typography variant="title" style={{color: 'white'}}>
                  Example Application
                </Typography>
              </Grid>
              <Grid item xs={4}
                style={{
                  padding: '1px',
                  textAlign: 'right'
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={this.state.editPosts}
                      onChange={() => this.setState({editPosts: !this.state.editPosts})}
                    />
                  }
                  label={
                    <Typography style={{color: 'white'}}>
                      EDIT
                    </Typography>
                  }
                />
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <div style={{
          margin: '16px',
        }}>
          <Paper style={{
            padding: '16px'
          }}>
            <FormGroup>
              <InputLabel>
                New Blog Post
              </InputLabel>
              <br />
              <TextField
                value={this.props.store.currentPostContent}
                placeholder="start your adventure!"
                fullWidth
                multiline
                onChange={(e) => this.props.dispatch.setPostContent(e.target.value)}
              />
              <br />
              <Button
                color="primary"
                onClick={() => {
                  this.props.dispatch.createNewPost(this.props.store.currentPostContent);
                }}
                variant="raised"
              >
                Submit
              </Button>
            </FormGroup>
          </Paper>
          {
            this.props.store.posts.map((post) => {
              return (
                <div
                  className="post"
                  key={`post-${post.id}`}
                  style={{
                    marginTop: '16px',
                  }}
                >
                  <Paper style={{
                    padding: '8px',
                  }}>
                    {
                      (post.editing) && (
                        <TextField
                          fullWidth
                          multiline
                          onChange={(e) => {
                            console.info(e.target.value);
                            console.info(this.props.dispatch);
                            this.props.dispatch.updatePostContent(
                              post.id, e.target.value
                            );
                          }}
                          value={post.content}
                        />
                      ) || (
                        <Typography
                          style={{
                            whiteSpace: 'pre-wrap',
                            lineBreak: 'normal',
                          }}
                        >
                          {post.content}
                        </Typography>
                      )
                    }
                    <Divider
                      style= {{
                        margin: '16px 0',
                      }}
                    />
                    <div style={{
                      textAlign: 'right',
                    }}>
                      <Typography>
                        Posted: {moment(post.created_at).format('ddd, DD MMM YYYY @ hh:mm:ss A')}
                      </Typography>
                      {
                        (this.state.editPosts) && (
                          (post.editing) && (
                            <Button
                              onClick={() => this.props.dispatch.updatePostWithId(post.id, post.content)}
                              variant="outlined"
                            >
                              Submit
                            </Button>
                          ) || (
                            <Button
                              onClick={() => this.props.dispatch.deletePostWithId(post.id)}
                              variant="outlined"
                            >
                              Delete
                            </Button>
                          )
                        ) || ('')
                      }
                      {
                        (this.state.editPosts) && (
                          <Button
                            onClick={() => this.props.dispatch.editPostContent(post.id)}
                            variant="outlined"
                          >
                            {(post.editing) && ('cancel') || ('edit')}
                          </Button>
                        ) || ('')
                      }
                    </div>
                  </Paper>
                </div>
              )
            })
          }
        </div>
      </div>
    );
  }
}

# Dropzone
Dropzone is a video assessment application which allows an assessment creator to create assessments, to which uploaders can record a video submission. Dropzone allows for video uploaders to record a video entirely within the browser, without needing to upload files.

## [Demo Video](guide_videos/Demo%20Video.mp4)
https://github.com/UBC-CIC/Streaming-Video-Assessment/assets/46551607/9db292d9-91dc-4b13-aac6-f0b5d9efcd49

## Files And Directories

1. `/frontend/amplify/backend/function/api/src`: Contains all the backend code
    1. `/frontend/amplify/backend/function/api/src/sequelize/models`: Contains database models
1. `/frontend/src`: Contains all frontend React code
1. `/docs`: Contains relevant documentation files

## High Level Architecture

![Architecture Diagram](docs/architecture.png)

### Database Design

![Database Design](docs/db_diagram.png)

## Deployment Guide

To deploy this solution, please follow the steps laid out in the [Deployment Guide](docs/DeploymentGuide.md)


# Screenshots

## Assesment Creator Workflow

### Sign-in Page
![](docs/images/1login.png)

### Home Page (Folder View)
![](docs/images/2homeFolderView.png)

### Home Page (List View)
![](docs/images/3homeListView.png)

### Creating New Group
![](docs/images/5CreateGroup.png)

### Creating New Assessment
![](docs/images/6CreateAssessment.png)

### Viewing New Assessment
![](docs/images/7ViewAssessment.png)

### Viewing Submissions
![](docs/images/8ViewSubmissions.png)


## Uploader Workflow

### Begin Submission
![](docs/images/9BeginSubmission.png)

### Recording Submission
![](docs/images/11Recording.png)

### Finished Submission
![](docs/images/12FinishedSubmission.png)


## Future Considerations

* Video Editing Option: Our platform does not an option for video editing, which can make the process of recording long videos require many attempts. A post-recording review page, where uploaders can edit and manage their submission, may be able to solve this pain point.

* Platform Manager Workflow: The Platform Manager concept extends could be the school’s IT admins who manage permissions of users. The could also invite teachers to the platform, since currently anyone can create an assessment creator account.

* Improved recording performance: We've noticed on some older devices the uploader recording page can be painfully slow. Perhaps older devices could detected and we could limit certain features (such as face blurring) to improve performance on those devices.

## Credits

This application was architected and developed by Eran Deutsch, Aryan Gandhi, Harrison Mitgang, Jayden Wong, and Stanley Zhao with capstone instructor Sidney Fels and TA Hamidreza Aftabi. A special thanks to Scott McMillan and Liana Leung at the UBC Cloud Innovation Centre for their guidance and support.

## License

This project is distributed under the [MIT License](LICENSE)

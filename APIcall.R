library(httr)
library(tidyverse)

## Don't hard code the token and DONT check it into Github
token = readRDS("~/.mytoken.RDS")

bd <- map(1:100,~list(studyId=sprintf("NCI-%04d",.x))) 
response = POST(url = "https://us-central1-nih-nci-dceg-episphere-dev.cloudfunctions.net/getParticipantToken", 
                config = add_headers("Content-Type" = "application/json", Authorization = paste0("Bearer ",token) ) ,
                body = list("data"=bd),
                encode = "json",
                verbose()
                )

content(response)$code
content(response)$data %>% bind_rows()


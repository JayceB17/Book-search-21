import { gql } from '@apollo/client';

export const GET_ME = gql`
query {
    getMe {
        _id
        email
        usermane
        bookCount
        savedBooks{
            _id
            title
            authors
            link
            description
            bookId
            image
        }
    }
}
`;
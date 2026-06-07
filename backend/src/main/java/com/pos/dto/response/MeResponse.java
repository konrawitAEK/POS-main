package com.pos.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data @AllArgsConstructor
public class MeResponse {
    private Long   id;
    private String username;
    private String fullName;
    private String role;
    private String email;
}

package com.coachkit.core.dto.request;

import lombok.Data;

@Data
public class TemplateFilterRequest {
    private int page = 0;
    private int size = 20;
    private String name;
}
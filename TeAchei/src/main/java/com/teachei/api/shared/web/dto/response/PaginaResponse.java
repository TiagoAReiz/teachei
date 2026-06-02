package com.teachei.api.shared.web.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record PaginaResponse<T>(
    @JsonProperty("content")
    List<T> content,
    
    @JsonProperty("page")
    int page,
    
    @JsonProperty("size")
    int size,
    
    @JsonProperty("totalElements")
    long totalElements,
    
    @JsonProperty("totalPages")
    int totalPages,
    
    @JsonProperty("hasNext")
    boolean hasNext,
    
    @JsonProperty("hasPrevious")
    boolean hasPrevious
) {
    public static <T> PaginaResponse<T> of(List<T> content, int page, int size, 
                                           long totalElements, int totalPages) {
        return new PaginaResponse<>(
            content,
            page,
            size,
            totalElements,
            totalPages,
            page < totalPages - 1,
            page > 0
        );
    }
}




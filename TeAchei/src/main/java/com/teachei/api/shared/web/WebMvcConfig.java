package com.teachei.api.shared.web;

import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web MVC configuration for custom converters and formatters.
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    private final StringToTipoVeiculoConverter stringToTipoVeiculoConverter;

    public WebMvcConfig(StringToTipoVeiculoConverter stringToTipoVeiculoConverter) {
        this.stringToTipoVeiculoConverter = stringToTipoVeiculoConverter;
    }

    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(stringToTipoVeiculoConverter);
    }
}

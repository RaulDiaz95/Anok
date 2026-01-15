package com.anok.repository;

import com.anok.model.VenuePhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VenuePhotoRepository extends JpaRepository<VenuePhoto, UUID> {
    List<VenuePhoto> findAllByVenue_IdOrderByCreatedAtAsc(UUID venueId);
}

class FloorsController < ApplicationController
    before_filter :filter_show, :only => [ :show ]
    def index
        @floors = Floor.all
    end
    def show
        # @floor = Floor.find(params[:id])
        # render json: @floor
        # respond_to do |format|
        #   format.html # show.html.erb
        #   format.json { render json: @floor }
        # end
    end
    
    def get_via_ajax
      @floor = Floor.find(params[:id])
      # Find @foo based on the ID passed @foo = Foo.find(params[:id].to_i)
      # Respond with JSON. This would respond with something like '{"id": 1, "name": "FooBar"}'
      render :text => @floor.to_json
    end
    
    def new
        @floor = Floor.new
    end
    
    def edit
        @floor = Floor.find(params[:id])
    end
    
    def create
        # def create
        #   render plain: params[:floor].inspect
        # end
        @floor = Floor.new(floor_params)
 
        if @floor.save
            redirect_to edit_floor_url(@floor)
        else
            render 'new'
        end
    end
  
    def update
        @floor = Floor.find(params[:id])
        
        # if @floor.update(floor_params)
        #     redirect_to edit_floor_path(@floor)
        # end
        # else
        #     render 'edit'
        #     # render plain: params[:floor].inspect# 
        # end
        respond_to do |format|
            if @floor.update(floor_params)
                format.html { redirect_to @floor, notice: 'successfully updated.' }
                format.js
            else
                format.html { render action: "edit" }
                format.js
            end
        end
    end
        
    def destroy
        @floor = Floor.find(params[:id])
        @floor.destroy
        
        redirect_to floors_path
    end
private
    def floor_params
        params.require(:floor).permit(:name, :json, :level)
    end
    def filter_show
        @floor = Floor.find(params[:id])
        if params[:json]
            render json: @floor
        else
        end
    end
end

#   ,
#       contentType:'application/html; charset=utf-8',
#       dataType: 'html'